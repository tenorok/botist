import * as http from 'http';
import express = require('express');
import Response from './Response';

export interface IAdapter {
    readonly webHookPath: string;
    onRequest(req: express.Request, res: express.Response): IBaseMessage[];
    sendText(id: string, text: string): Promise<IResponse | IError>;
}

export interface IOptions {
    port: number;
}

export interface IAbstractMessage {
    chatId: string;
    timestamp: number;
}

export interface ITextMessage extends IAbstractMessage {
    type: 'text';
    text: string;
}

export interface IImageMessage extends IAbstractMessage {
    type: 'image';
    url: string;
}

export type IBaseMessage = ITextMessage | IImageMessage;

export interface IExtendedMessage {
    name: string;
}

export type IMessage = IBaseMessage & IExtendedMessage;

export interface IResponse {
    messageId: string;
}

export interface IError {
    type: string;
    code: number;
    message: string;
    statusCode: number;
}

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

export class Botist {
    private express: express.Express;
    private adaptersList: IAdapter[] = [];
    private messageHandlers: IMessageHandlers = {
        text: [],
        image: [],
    };
    private server: http.Server;

    constructor(options: IOptions) {
        this.express = express();
        this.express.use(express.json());
        this.server = this.express.listen(options.port);
    }

    public destructor() {
        this.server.close();
    }

    public adapter(adapter: IAdapter): void {
        this.adaptersList.push(adapter);
        this.express.post(adapter.webHookPath, (req, res) => {
            const messages = adapter.onRequest(req, res);
            for (const baseMsg of messages) {
                const msg: IMessage = baseMsg as IMessage;
                msg.name = adapter.constructor.name;
                this.onMessage(adapter, msg);
            }
        });
    }

    public text(text: string | RegExp, callback: MessageCallback<ITextMessage & IExtendedMessage>): void {
        this.messageHandlers.text.push({
            text,
            callback,
        });
    }

    private onMessage(adapter: IAdapter, msg: IMessage, startHandlerIndex = 0): void {
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
}
