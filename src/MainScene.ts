import { Botist, IAdapter } from './Botist';
import {
    IExtendedMessage,
    ITextMessage,
    IImageMessage,
    IMessage,
} from './Message';
import Response from './Response';

interface IMessageHandlers {
    text: ITextMessageHandler[];
    image: IImageMessageHandler[];
}

export type MessageCallback<M> = (msg: M, res: Response, next: () => void) => void;

interface ITextMessageHandler {
    text: string | RegExp;
    callback: MessageCallback<ITextMessage & IExtendedMessage>;
}

interface IImageMessageHandler {
    callback: MessageCallback<IImageMessage & IExtendedMessage>;
}

export interface IScene {
    subscribe(): void;
    enter(): void;
    exit(): void;
    text(text: string | RegExp, callback: MessageCallback<ITextMessage & IExtendedMessage>): void;
    onMessage(adapter: IAdapter, msg: IMessage, startHandlerIndex?: number): void;
}

export abstract class MainScene implements IScene {
    private messageHandlers: IMessageHandlers = {
        text: [],
        image: [],
    };

    constructor(private botist: Botist) {
        this.subscribe();
    }

    public abstract subscribe(): void;

    public enter() {
        this.botist.scene(this);
    }

    public exit() {}

    public text(text: string | RegExp, callback: MessageCallback<ITextMessage & IExtendedMessage>): void {
        this.messageHandlers.text.push({
            text,
            callback,
        });
    }

    public onMessage(adapter: IAdapter, msg: IMessage, startHandlerIndex: number = 0): void {
        for (let i = startHandlerIndex; i < this.messageHandlers[msg.type].length; i++) {
            const handler = this.messageHandlers[msg.type][i];
            if (msg.type === 'text' && !msg.text.match((handler as ITextMessageHandler).text)) {
                continue;
            }

            const res = new Response(msg.chatId, adapter);
            handler.callback.call(null, msg, res, () => {
                this.onMessage(adapter, msg, i + 1);
            });
            break;
        }
    }

    protected scenario() {
        this.botist.scenario();
    }
}
