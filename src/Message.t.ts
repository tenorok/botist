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
