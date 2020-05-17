import { Botist, IAdapter } from '../Botist';
import { Response } from '../Response';
import { ITextMessage, IImageMessage, IMessage } from '../Message.t';
import { IScene } from '../MainScene';
import { SubscriberContext } from '../SubscriberContext';
export declare type ISubscriberCallback<M> = (this: SubscriberContext, msg: M, res: Response, next: () => void) => void;
interface ISubscriberOptions {
    labels?: string[];
}
interface IMessageInnerOptions<TYPE extends string> extends Required<ISubscriberOptions> {
    type: TYPE;
}
export interface ITextSubscriber {
    text: string | RegExp;
    callback: ISubscriberCallback<ITextMessage>;
    options: IMessageInnerOptions<'text'>;
}
export interface IImageSubscriber {
    callback: ISubscriberCallback<IImageMessage>;
    options: IMessageInnerOptions<'image'>;
}
export declare type ISubscriber = ITextSubscriber | IImageSubscriber;
export interface ISubscribers {
    text: ITextSubscriber[];
    image: IImageSubscriber[];
}
export interface IMessageMiddleware {
    subscribe(): void;
    text(text: string | RegExp, callback: ISubscriberCallback<ITextMessage>): void | Promise<void>;
    guard(scene: IScene, msg: IMessage): boolean;
    continue(): boolean;
    onMessage(adapter: IAdapter, scene: IScene, msg: IMessage, startHandlerIndex?: number): Promise<void>;
}
export declare abstract class MessageMiddleware implements IMessageMiddleware {
    private botist;
    protected _subscribers: ISubscribers;
    constructor(botist: Botist);
    abstract subscribe(): void;
    text(text: string | RegExp, callback: ISubscriberCallback<ITextMessage>, options?: ISubscriberOptions): void;
    /**
     * Determines the need to applying middleware for scene and message.
     */
    guard(_scene: IScene, _msg: IMessage): boolean;
    /**
     * Determines the need to call the handlers of the next middleware.
     */
    continue(): boolean;
    onMessage(adapter: IAdapter, scene: IScene, msg: IMessage, startSubscriberIndex?: number): Promise<void>;
}
export {};
