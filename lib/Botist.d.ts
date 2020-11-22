import express = require('express');
import { IBaseMessage } from './Message.t';
import { IScene } from './MainScene';
import { Scenario } from './Scenario';
import { Response } from './Response';
import { IMessageMiddleware } from './Middlewares/Message';
import { ICatchMiddleware } from './Middlewares/Catch';
import SendError from './Errors/SendError';
import { IEvent } from './Events/Event';
export interface ISuccess {
    messageId: string;
    /** Exists when sending poll. */
    pollId?: string;
}
/** Error is null when it was handled by catch callback. */
export declare type IError = null | SendError;
export declare type IResponse = ISuccess | IError;
export interface ITextMessageOptions {
    disableWebPagePreview?: boolean;
}
export interface IPoll {
    question: string;
    options: string[];
    multiple?: boolean;
}
export interface IAdapter {
    readonly name: string;
    readonly webHookPath: string;
    errorHandler: IErrorHandler;
    onRequest(req: express.Request, res: express.Response): IBaseMessage[];
    sendText(id: string, text: string, options?: ITextMessageOptions): Promise<IResponse>;
    sendMarkdown(id: string, markdown: string, options?: ITextMessageOptions): Promise<IResponse>;
    sendPoll(id: string, poll: IPoll): Promise<IResponse>;
}
export declare type IErrorHandler = (err: SendError) => Promise<IError>;
declare type ICatch = (err: SendError) => void;
export interface IOptions {
    port: number;
    scene: new (botist: Botist) => IScene;
    catch?: ICatch;
}
export interface IFrom {
    adapter: string;
    chatId: string;
}
export declare class Botist {
    private express;
    private adaptersList;
    private beforeSceneList;
    private afterSceneList;
    private catchList;
    private server;
    private _mainScene;
    private currentScene;
    private globalCatch?;
    constructor(options: IOptions);
    destructor(): void;
    adapter(adapter: IAdapter): void;
    getAdapter(name: string): IAdapter | null;
    scenario(from: IFrom, res: Response, scenario: Scenario, next?: () => void): void;
    scene(from: IFrom, res: Response, event: IEvent, scene: IScene): void;
    mainScene(from: IFrom, res: Response, event: IEvent): void;
    beforeScene(middleware: IMessageMiddleware): void;
    afterScene(middleware: IMessageMiddleware): void;
    catch(middleware: ICatchMiddleware): void;
    private onAdapterRequest;
    private onError;
    private getSceneKey;
    private getCurrentScene;
}
export {};
