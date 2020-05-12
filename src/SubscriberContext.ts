import { ReadonlyDeep } from 'type-fest';
import { ISubscriber, ITextSubscriber } from './Middlewares/Message';
import { IScene } from './MainScene';
import { IMessage } from './Message.t';

export type ISubscribersFilter = (subscriber: ISubscriber) => boolean;

export class SubscriberContext {
    private static isTextSubscriber(subscriber: ISubscriber): subscriber is ITextSubscriber {
        return subscriber.options.type === 'text';
    }

    constructor(
        private scene: IScene,
        private msg: IMessage,
    ) {}

    public getSceneSubscribers(filter?: ISubscribersFilter): Array<ReadonlyDeep<ISubscriber>> {
        const list: ISubscriber[] = [];
        list.push(...this.scene.subscribers.text, ...this.scene.subscribers.image);

        if (filter) {
            const filteredList = [];
            for (const subscriber of list) {
                if (filter.call(null, subscriber)) {
                    filteredList.push(subscriber);
                }
            }
            return filteredList;
        }

        return list;
    }

    public match(subscriber: ISubscriber): boolean {
        if (
            this.msg.type === 'text' && SubscriberContext.isTextSubscriber(subscriber) &&
            (
                typeof subscriber.text === 'string' && this.msg.text === subscriber.text ||
                subscriber.text instanceof RegExp && this.msg.text.match(subscriber.text)
            )
        ) {
            return true;
        }

        return false;
    }
}
