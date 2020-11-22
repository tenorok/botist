interface IAbstractMessage {
    chatId: string;
    timestamp: number;
    /**
     * @see https://en.wikipedia.org/wiki/IETF_language_tag
     */
    language?: string;
}
export declare enum MessageType {
    text = "text",
    image = "image",
    poll = "poll"
}
interface IBaseTextMessage extends IAbstractMessage {
    type: MessageType.text;
    text: string;
}
interface IBaseImageMessage extends IAbstractMessage {
    type: MessageType.image;
    url: string;
}
interface IBasePollMessage extends IAbstractMessage {
    type: MessageType.poll;
    pollId: string;
    answers: number[];
}
interface IExtendedMessage {
    /** Adapter name. */
    adapter: string;
}
export declare type IBaseMessage = IBaseTextMessage | IBaseImageMessage | IBasePollMessage;
export declare type ITextMessage = IBaseTextMessage & IExtendedMessage;
export declare type IImageMessage = IBaseImageMessage & IExtendedMessage;
export declare type IPollMessage = IBasePollMessage & IExtendedMessage;
export declare type IMessage = ITextMessage | IImageMessage | IPollMessage;
export {};
