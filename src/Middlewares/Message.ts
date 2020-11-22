import { Botist, IAdapter } from '../Botist';
import { Response } from '../Response';
import {
    ITextMessage,
    IImageMessage,
    IPollMessage,
    IMessage,
    MessageType,
} from '../Message.t';
import { IScene } from '../MainScene';
import { SceneContext } from '../SceneContext';

export type ISubscriberMatcher<M> = (this: SceneContext, msg: M) => boolean;
export type ISubscriberCallback<M> = (this: SceneContext, msg: M, res: Response, next: () => void) => void;

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

export type ISubscriber = ITextSubscriber | IImageSubscriber | IPollSubscriber;

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

export abstract class MessageMiddleware implements IMessageMiddleware {
    protected _subscribers: ISubscribers = {
        text: [],
        image: [],
        poll: [],
    };

    public get subscribers(): ISubscribers {
        return this._subscribers;
    }

    constructor(private botist: Botist) {
        this.subscribe();
    }

    public abstract subscribe(): void;

    public text(
        matcher: ISubscriberMatcher<ITextMessage> | string | RegExp,
        callback: ISubscriberCallback<ITextMessage>,
        options?: ISubscriberOptions,
    ): void {
        this.subscriber<ITextSubscriber, MessageType.text>(
            MessageType.text,
            matcher,
            callback,
            options,
        );
    }

    public poll(
        matcher: ISubscriberMatcher<IPollMessage>,
        callback: ISubscriberCallback<IPollMessage>,
        options?: ISubscriberOptions,
    ): void {
        this.subscriber<IPollSubscriber, MessageType.poll>(
            MessageType.poll,
            matcher,
            callback,
            options,
        );
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
    public continue(_scene: IScene, _msg: IMessage): boolean {
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
            const ctx = new SceneContext(scene, msg);
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

    private subscriber<
        M extends ISubscriber,
        T extends MessageType,
    >(
        type: T,
        matcher: M['matcher'],
        callback: M['callback'],
        options?: ISubscriberOptions,
    ) {
        const innerOptions: IMessageInnerOptions<T> = {
            type,
            labels: [],
        };

        if (options && options.labels) {
            innerOptions.labels.push(...options.labels);
        }

        // Subscriber type and information always matched.
        (this._subscribers[type] as ITextSubscriber[]).push({
            matcher,
            callback,
            options: innerOptions,
        } as ITextSubscriber);
    }
}
