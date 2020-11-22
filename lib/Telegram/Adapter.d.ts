import { Request, Response } from 'express';
import { IAdapter, ITextMessageOptions, IResponse as IBotistResponse, IErrorHandler, IPoll } from '../Botist';
import { IBaseMessage } from '../Message.t';
export declare class Telegram implements IAdapter {
    private webHookUrl;
    private static apiHost;
    name: string;
    private apiUrl;
    private _errorHandler?;
    constructor(token: string, webHookUrl: string);
    get webHookPath(): string;
    set errorHandler(handler: IErrorHandler);
    onRequest(req: Request, res: Response): IBaseMessage[];
    sendText(id: string, text: string, options?: ITextMessageOptions): Promise<IBotistResponse>;
    sendMarkdown(id: string, markdown: string, options?: ITextMessageOptions): Promise<IBotistResponse>;
    sendPoll(id: string, poll: IPoll): Promise<IBotistResponse>;
    private _sendText;
    private setWebHook;
    private handleError;
}
