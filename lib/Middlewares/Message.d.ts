import { Botist, IAdapter } from '../Botist';
import { Response } from '../Response';
import { ITextMessage, IImageMessage, IPollMessage, IMessage, MessageType } from '../Message.t';
import { IScene } from '../MainScene';
import { SceneContext } from '../SceneContext';
export declare type ISubscriberMatcher<M> = (this: SceneContext, msg: M) => boolean;
export declare type ISubscriberCallback<M> = (this: SceneContext, msg: M, res: Response, next: () => void) => void;
interface ISubscriberOptions {
    labels?: string[];
}
interface IMessageInnerOptions<T extends MessageType> extends Required<ISubscriberOptions> {
    type: T;
}
export interface ITextSubscriber {
    matcher: ISubscriberMatcher<ITextMessage> | string | RegExp;
    callback: ISubscriberCallback<ITextMessage>;
    options: IMessageInnerOptions<MessageType.text>;
}
export interface IImageSubscriber {
    matcher: ISubscriberMatcher<IImageMessage>;
    callback: ISubscriberCallback<IImageMessage>;
    options: IMessageInnerOptions<MessageType.image>;
}
export interface IPollSubscriber {
    matcher: ISubscriberMatcher<IPollMessage>;
    callback: ISubscriberCallback<IPollMessage>;
    options: IMessageInnerOptions<MessageType.poll>;
}
export declare type ISubscriber = ITextSubscriber | IImageSubscriber | IPollSubscriber;
export interface ISubscribers {
    text: ITextSubscriber[];
    image: IImageSubscriber[];
    poll: IPollSubscriber[];
}
export interface IMessageMiddleware {
    subscribers: ISubscribers;
    guard(scene: IScene, msg: IMessage): boolean;
    continue(scene: IScene, msg: IMessage): boolean;
    onMessage(adapter: IAdapter, scene: IScene, msg: IMessage, startHandlerIndex?: number): Promise<void>;
}
export declare abstract class MessageMiddleware implements IMessageMiddleware {
    private botist;
    protected _subscribers: ISubscribers;
    get subscribers(): ISubscribers;
    constructor(botist: Botist);
    abstract subscribe(): void;
    text(matcher: ISubscriberMatcher<ITextMessage> | string | RegExp, callback: ISubscriberCallback<ITextMessage>, options?: ISubscriberOptions): void;
    poll(matcher: ISubscriberMatcher<IPollMessage>, callback: ISubscriberCallback<IPollMessage>, options?: ISubscriberOptions): void;
    /**
     * Determines the need to applying this middleware for scene and message.
     */
    guard(_scene: IScene, _msg: IMessage): boolean;
    /**
     * Determines the need to call handlers of the next middleware.
     */
    continue(_scene: IScene, _msg: IMessage): boolean;
    onMessage(adapter: IAdapter, scene: IScene, msg: IMessage, startSubscriberIndex?: number): Promise<void>;
    private subscriber;
}
export {};
