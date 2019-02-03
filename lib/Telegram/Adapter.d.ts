import { Request, Response } from 'express';
import { IAdapter, ITextMessageOptions, IResponse as IBotistResponse } from '../Botist';
import { IBaseMessage } from '../Message.t';
export declare class Telegram implements IAdapter {
    private webHookUrl;
    private static apiHost;
    name: string;
    private apiUrl;
    constructor(token: string, webHookUrl: string);
    readonly webHookPath: string;
    onRequest(req: Request, res: Response): IBaseMessage[];
    sendText(id: string, text: string, options?: ITextMessageOptions): Promise<IBotistResponse>;
    sendMarkdown(id: string, markdown: string, options?: ITextMessageOptions): Promise<IBotistResponse>;
    private _sendText;
    private setWebHook;
}
