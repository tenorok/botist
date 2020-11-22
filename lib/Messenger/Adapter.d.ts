import { Request, Response } from 'express';
import { IAdapter, IResponse as IBotistResponse, IErrorHandler, IPoll } from '../Botist';
import { IBaseMessage } from '../Message.t';
export declare class Messenger implements IAdapter {
    private token;
    webHookPath: string;
    private static apiUrl;
    name: string;
    private _errorHandler?;
    constructor(token: string, webHookPath: string);
    set errorHandler(handler: IErrorHandler);
    onRequest(req: Request, res: Response): IBaseMessage[];
    sendText(id: string, text: string): Promise<IBotistResponse>;
    /**
     * Messenger doesn't support markdown.
     * https://docs.botframework.com/en-us/channel-inspector/channels/Facebook/#navtitle
     */
    sendMarkdown(id: string, markdown: string): Promise<IBotistResponse>;
    sendPoll(_id: string, _poll: IPoll): Promise<IBotistResponse>;
    private _sendText;
    private hasMessageText;
    private handleError;
}
