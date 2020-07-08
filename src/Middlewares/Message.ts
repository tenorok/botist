import { Botist, IAdapter } from '../Botist';
import { Response } from '../Response';
import {
    ITextMessage,
    IImageMessage,
    IMessage,
} from '../Message.t';
import { IScene } from '../MainScene';
import { SubscriberContext } from '../SubscriberContext';

export type ISubscriberCallback<M> = (this: SubscriberContext, msg: M, res: Response, next: () => void) => void;

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

export type ISubscriber = ITextSubscriber | IImageSubscriber;

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

export abstract class MessageMiddleware implements IMessageMiddleware {
    protected _subscribers: ISubscribers = {
        text: [],
        image: [],
    };

    constructor(private botist: Botist) {
        this.subscribe();
    }

    public abstract subscribe(): void;

    public text(
        text: string | RegExp,
        callback: ISubscriberCallback<ITextMessage>,
        options?: ISubscriberOptions,
    ): void {
        const innerOptions: IMessageInnerOptions<'text'> = {
            type: 'text',
            labels: [],
        };

        if (options && options.labels) {
            innerOptions.labels.push(...options.labels);
        }

        this._subscribers.text.push({
            text,
            callback,
            options: innerOptions,
        });
    }

    /**
     * Determines the need to applying this middleware for scene and message.
     */
    public guard(_scene: IScene, _msg: IMessage): boolean {
        return true;
    }

    /**
     * Determines the need to call handlers of the next middleware.
     */
    public continue(): boolean {
        return true;
    }

    public async onMessage(
        adapter: IAdapter,
        scene: IScene,
        msg: IMessage,
        startSubscriberIndex: number = 0,
    ): Promise<void> {
        const subscribers = this._subscribers[msg.type];
        for (let i = startSubscriberIndex; i < subscribers.length; i++) {
            const ctx = new SubscriberContext(scene, msg);
            const subscriber = subscribers[i];
            if (!ctx.match(subscriber)) {
                continue;
            }

            const res = new Response(this.botist, adapter, msg);
            // If subscriber matched to message then their types are equal.
            return (subscriber as ITextSubscriber).callback.call(ctx, msg as ITextMessage, res, () => {
                return this.onMessage(adapter, scene, msg, i + 1);
            });
        }
    }
}
