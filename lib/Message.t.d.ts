interface IAbstractMessage {
    chatId: string;
    timestamp: number;
}
interface IBaseTextMessage extends IAbstractMessage {
    type: 'text';
    text: string;
}
interface IBaseImageMessage extends IAbstractMessage {
    type: 'image';
    url: string;
}
interface IExtendedMessage {
    /** Adapter name. */
    name: string;
}
export declare type IBaseMessage = IBaseTextMessage | IBaseImageMessage;
export declare type ITextMessage = IBaseTextMessage & IExtendedMessage;
export declare type IImageMessage = IBaseImageMessage & IExtendedMessage;
export declare type IMessage = ITextMessage | IImageMessage;
export {};
