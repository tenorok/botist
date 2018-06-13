/// <reference types="express" />
import express = require('express');
import { IBaseMessage } from './Message.t';
import { IScene } from './MainScene';
import { Scenario } from './Scenario';
export interface IAdapter {
    readonly webHookPath: string;
    onRequest(req: express.Request, res: express.Response): IBaseMessage[];
    sendText(id: string, text: string): Promise<IResponse | IError>;
}
export interface IOptions {
    port: number;
    scene: new (botist: Botist) => IScene;
}
export interface IResponse {
    messageId: string;
}
export interface IError {
    type: string;
    code: number;
    message: string;
    statusCode: number;
}
export declare class Botist {
    private express;
    private adaptersList;
    private server;
    private _mainScene;
    private currentScene;
    constructor(options: IOptions);
    destructor(): void;
    adapter(adapter: IAdapter): void;
    scenario(scenario: Scenario, next?: () => void): void;
    scene(scene: IScene): void;
    mainScene(): void;
}
