import { MessageType } from '../Message.t';

interface ISendError {
    adapter: string;
    chatId: string;
    messageType: MessageType;
    type: string;
    text: string;
    /** Error code from some messenger. */
    code: number;
    /** Error code of request to server. */
    statusCode: number;
}

export default class SendError extends Error implements ISendError {
    public adapter: string;
    public chatId: string;
    public messageType: MessageType;
    public type: string;
    public text: string;
    public code: number;
    public statusCode: number;

    constructor(err: ISendError) {
        super(`${err.adapter} with ${err.type} ${err.statusCode}. ${err.text}`);

        this.adapter = err.adapter;
        this.chatId = err.chatId;
        this.messageType = err.messageType;
        this.type = err.type;
        this.text = err.text;
        this.code = err.code;
        this.statusCode = err.statusCode;
    }
}
