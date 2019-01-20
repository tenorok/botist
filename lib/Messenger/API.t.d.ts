export interface IUpdate {
    object: 'page';
    entry: Array<{
        id: string;
        time: number;
        messaging: IMessage[];
    }>;
}
export interface IResult {
    recipient_id: string;
    message_id: string;
}
export interface IRequestError extends requestPromise.IError {
    error: {
        error: {
            message: string;
            type: string;
            code: number;
        };
    };
}
export declare type IMessage = ITextMessage | IAttachmentMessage | IScrapingLinkMessage;
export interface IBaseMessage {
    sender: {
        id: string;
    };
    recipient: {
        id: string;
    };
    timestamp: number;
}
export interface ITextMessage extends IBaseMessage {
    message: {
        mid: string;
        text: string;
        quick_reply?: {
            payload: string;
        };
    };
}
export interface IAttachmentMessage extends IBaseMessage {
    message: {
        mid: string;
        attachments: Array<{
            type: 'image' | 'video' | 'audio' | 'file';
            payload: {
                url: string;
            };
        }>;
    };
}
export interface IScrapingLinkMessage extends IBaseMessage {
    message: {
        mid: string;
        text: string;
        attachments: Array<{
            type: 'fallback';
            payload: null;
            title: string;
            URL: string;
        }>;
    };
}
