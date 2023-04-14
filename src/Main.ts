import 'reflect-metadata';
import {Observable} from "./Observable";
import {DiscordMessageEvent} from "./decorators/DiscordMessageEvent";
import {container, singleton} from "tsyringe";
import {PageInterceptor} from "./PageInterceptor";
import {PostConstruct} from "./decorators/PostConstruct";

@singleton()
class DiscordChatObserver implements Observable {


    public removeElm(elms: Element[]): void {
        for (let elm of elms) {
            elm.remove();
        }
    }

    @DiscordMessageEvent
    public observe(mutationList: MutationRecord[], observer: MutationObserver): void {
        const elmsToRemove = mutationList.flatMap(mutationRecord => {
            const retArr: Element[] = [];
            for (let i = 0; i < mutationRecord.addedNodes.length; i++) {
                const addedMessage = mutationRecord.addedNodes[i];
                if (!(addedMessage instanceof Element)) {
                    continue;
                }
                const isBlockedMessage = addedMessage.querySelector('[class^="blockedSystemMessage"]') !== null;
                if (isBlockedMessage) {
                    retArr.push(addedMessage);
                }
            }
            return retArr;
        });
        this.removeElm(elmsToRemove);
    }

    @PostConstruct
    private async init(): Promise<void> {
        const pageInterceptor = container.resolve(PageInterceptor);
        await pageInterceptor.pageChange(() => {
            const chatContainer = document.querySelector('[data-list-id="chat-messages"]');
            const toRemove: Element[] = [];
            for (let i = 0; i < chatContainer.children.length; i++) {
                const chatItem = chatContainer.children[i];
                const isBlockedMessage = chatItem.querySelector('[class^="blockedSystemMessage"]') !== null;
                if (isBlockedMessage) {
                    toRemove.push(chatItem);
                }
            }
            this.removeElm(toRemove);
        });
    }
}
