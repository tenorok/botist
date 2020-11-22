import bind from 'bind-decorator';
import {
    ISubscriber,
    IMessageMiddleware,
    ITextSubscriber,
    IPollSubscriber,
} from './Middlewares/Message';
import { IMessage, MessageType } from './Message.t';

export class SceneContext {
    private static isTextSubscriber(subscriber: ISubscriber): subscriber is ITextSubscriber {
        return subscriber.options.type === MessageType.text;
    }

    private static isPollSubscriber(subscriber: ISubscriber): subscriber is IPollSubscriber {
        return subscriber.options.type === MessageType.poll;
    }

    constructor(
        private scene: IMessageMiddleware,
        private msg: IMessage,
    ) {}

    public getSubscribers(): Array<Readonly<ISubscriber>> {
        return Object.values(this.scene.subscribers).flat();
    }

    @bind
    public match(subscriber: ISubscriber): boolean {
        if (
            this.msg.type === MessageType.text && SceneContext.isTextSubscriber(subscriber) &&
            (
                typeof subscriber.matcher === 'function' && subscriber.matcher.call(this, this.msg) ||
                typeof subscriber.matcher === 'string' && this.msg.text === subscriber.matcher ||
                subscriber.matcher instanceof RegExp && this.msg.text.match(subscriber.matcher)
            )
        ) {
            return true;
        }

        if (
            this.msg.type === MessageType.poll && SceneContext.isPollSubscriber(subscriber) &&
            subscriber.matcher.call(this, this.msg)
        ) {
            return true;
        }

        return false;
    }
}
