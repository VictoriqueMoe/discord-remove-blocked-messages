import {singleton} from "tsyringe";
import {DiscordMutatorProxy} from "./DiscordMutatorProxy";

@singleton()
export class PageInterceptor {
    public constructor(private _discordMutatorProxy: DiscordMutatorProxy) {

    }

    public async pageChange(callBack: () => void): Promise<void> {
        window.onload = () => {
            let oldHref = document.location.href;
            const body = document.querySelector("body");
            const observer = new MutationObserver(mutations => {
                mutations.forEach(() => {
                    if (oldHref !== document.location.href) {
                        oldHref = document.location.href;
                        this._discordMutatorProxy.init();
                        callBack();
                    }
                });
            });
            observer.observe(body, {childList: true, subtree: true});
        };
    }
}
