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
    adapter: string;
    chatId: string;
    messageType: MessageType;
    type: string;
    text: string;
    code: number;
    statusCode: number;
    constructor(err: ISendError);
}
export {};
