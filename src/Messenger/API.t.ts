export interface IUpdate {
    object: 'page';
    entry: Array<{
        id: string; // Bot id.
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

export type IMessage = ITextMessage | IAttachmentMessage | IScrapingLinkMessage;

export interface IBaseMessage {
    sender: {
        id: string; // User id.
    };
    recipient: {
        id: string; // Bot id.
    };
    timestamp: number;
}

// https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages
export interface ITextMessage extends IBaseMessage {
    message: {
        mid: string; // Message id.
        text: string;
        quick_reply?: {
            payload: string; // DEVELOPER_DEFINED_PAYLOAD
        };
    };
}
export interface IAttachmentMessage extends IBaseMessage {
    message: {
        mid: string;
        attachments: Array<{
            type: 'image' | 'video' | 'audio' | 'file';
            payload: {
                url: string; // ATTACHMENT_URL
            };
        }>;
    };
}
export interface IScrapingLinkMessage extends IBaseMessage {
    message: {
        mid: string;
        text: string; // URL_SENT_BY_THE_USER
        attachments: Array<{
            type: 'fallback';
            payload: null;
            title: string; // DEVELOPER_DEFINED_PAYLOAD
            URL: string; // URL_OF_THE_ATTACHMENT
        }>;
    };
}
