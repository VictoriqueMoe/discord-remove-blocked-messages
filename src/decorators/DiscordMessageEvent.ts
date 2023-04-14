import {container, InjectionToken} from "tsyringe";
import {DiscordMutatorProxy} from "../DiscordMutatorProxy";
import {Observable} from "../Observable";

export function DiscordMessageEvent(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const constructor = target.constructor as InjectionToken<Observable>;
    const context = container.resolve(constructor);
    const mutatorProxy = container.resolve(DiscordMutatorProxy);
    mutatorProxy.addObserver(context);
}
