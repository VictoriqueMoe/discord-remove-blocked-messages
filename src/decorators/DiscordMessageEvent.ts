import {container, InjectionToken} from "tsyringe";
import {Observable} from "../Observable";
import {DiscordMutatorProxy} from "../impl/DiscordMutatorProxy";

export function DiscordMessageEvent(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const constructor = target.constructor as InjectionToken<Observable>;
    const context = container.resolve(constructor);
    const mutatorProxy = container.resolve(DiscordMutatorProxy);
    mutatorProxy.addObserver(context);
}
