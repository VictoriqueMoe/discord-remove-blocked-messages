import {container, singleton} from "tsyringe";
import {Observable} from "./Observable";
import {PostConstruct} from "./decorators/PostConstruct";
import {PageInterceptor} from "./PageInterceptor";

@singleton()
export class DiscordMutatorProxy {
    private readonly targetElement = '[data-list-id="chat-messages"]';

    private readonly observerList: Observable[] = [];

    private observerProxy: MutationObserver;

    @PostConstruct
    public async init(): Promise<void> {
        const elm = await this.waitForElm(this.targetElement);
        this.observerProxy = new MutationObserver((mutations, observer) => {
            for (const observable of this.observerList) {
                observable.observe(mutations, observer);
            }
        });
        this.observerProxy.observe(elm, {
            childList: true
        });
    }

    public addObserver(observer: Observable): void {
        this.observerList.push(observer);
    }

    private waitForElm(selector: string): Promise<Element> {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
}
