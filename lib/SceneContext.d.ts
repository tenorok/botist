import { ISubscriber, IMessageMiddleware } from './Middlewares/Message';
import { IMessage } from './Message.t';
export declare class SceneContext {
    private scene;
    private msg;
    private static isTextSubscriber;
    private static isPollSubscriber;
    constructor(scene: IMessageMiddleware, msg: IMessage);
    getSubscribers(): Array<Readonly<ISubscriber>>;
    match(subscriber: ISubscriber): boolean;
}
