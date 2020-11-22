interface IAbstractMessage {
    chatId: string;
    timestamp: number;
    /**
     * @see https://en.wikipedia.org/wiki/IETF_language_tag
     */
    language?: string;
}

export enum MessageType {
    text = 'text',
    image = 'image',
    poll = 'poll',
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

export type IBaseMessage = IBaseTextMessage | IBaseImageMessage | IBasePollMessage;
export type ITextMessage = IBaseTextMessage & IExtendedMessage;
export type IImageMessage = IBaseImageMessage & IExtendedMessage;
export type IPollMessage = IBasePollMessage & IExtendedMessage;
export type IMessage = ITextMessage | IImageMessage | IPollMessage;
