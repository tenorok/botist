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

export type IBaseMessage = IBaseTextMessage | IBaseImageMessage;
export type ITextMessage = IBaseTextMessage & IExtendedMessage;
export type IImageMessage = IBaseImageMessage & IExtendedMessage;
export type IMessage = ITextMessage | IImageMessage;
