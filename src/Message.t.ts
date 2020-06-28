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
}

interface IBaseTextMessage extends IAbstractMessage {
    type: MessageType.text;
    text: string;
}

interface IBaseImageMessage extends IAbstractMessage {
    type: MessageType.image;
    url: string;
}

interface IExtendedMessage {
    /** Adapter name. */
    name: string;
}

export type IBaseMessage = IBaseTextMessage | IBaseImageMessage;
export type ITextMessage = IBaseTextMessage & IExtendedMessage;
export type IImageMessage = IBaseImageMessage & IExtendedMessage;
export type IMessage = ITextMessage | IImageMessage;
