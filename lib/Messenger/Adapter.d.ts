import { Request, Response } from 'express';
import { IAdapter, IResponse as IBotistResponse, IErrorHandler } from '../Botist';
import { IBaseMessage } from '../Message.t';
export declare class Messenger implements IAdapter {
    private token;
    webHookPath: string;
    private static apiUrl;
    name: string;
    private _errorHandler?;
    constructor(token: string, webHookPath: string);
    errorHandler: IErrorHandler;
    onRequest(req: Request, res: Response): IBaseMessage[];
    sendText(id: string, text: string): Promise<IBotistResponse>;
    /**
     * Messenger doesn't support markdown.
     * https://docs.botframework.com/en-us/channel-inspector/channels/Facebook/#navtitle
     */
    sendMarkdown(id: string, markdown: string): Promise<IBotistResponse>;
    private _sendText;
    private hasMessageText;
}
