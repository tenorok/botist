import { ReadonlyDeep } from 'type-fest';
import { ISubscriber } from './Middlewares/Message';
import { IScene } from './MainScene';
import { IMessage } from './Message.t';
export declare type ISubscribersFilter = (subscriber: ISubscriber) => boolean;
export declare class SubscriberContext {
    private scene;
    private msg;
    private static isTextSubscriber;
    constructor(scene: IScene, msg: IMessage);
    getSceneSubscribers(filter?: ISubscribersFilter): Array<ReadonlyDeep<ISubscriber>>;
    match(subscriber: ISubscriber): boolean;
}
