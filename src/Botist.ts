import * as http from 'http';
import express = require('express');
import bind from 'bind-decorator';

import createDebug = require('debug');
const debugAdapter = createDebug('botist:adapter');

import {
    IBaseMessage,
    IMessage,
} from './Message.t';
import { IScene } from './MainScene';
import { Scenario } from './Scenario';
import { Response } from './Response';
import { IMessageMiddleware } from './Middlewares/Message';
import SendError from './Errors/SendError';
import { IEvent } from './Events/Event';

export interface ISuccess {
    messageId: string;
}

/** Error is null when it was handled by catch callback. */
export type IError = null | SendError;

export type IResponse = ISuccess | IError;

export interface ITextMessageOptions {
    disableWebPagePreview?: boolean;
}

export interface IAdapter {
    readonly name: string;
    readonly webHookPath: string;
    errorHandler: IErrorHandler;
    onRequest(req: express.Request, res: express.Response): IBaseMessage[];
    sendText(id: string, text: string, options?: ITextMessageOptions): Promise<IResponse>;
    sendMarkdown(id: string, markdown: string, options?: ITextMessageOptions): Promise<IResponse>;
}

export type IErrorHandler = (err: SendError) => Promise<IError>;
type ICatch = (err: SendError) => void;

export interface IOptions {
    port: number;
    scene: new (botist: Botist) => IScene;
    catch?: ICatch;
}

export interface IFrom {
    name: string;
    chatId: string;
}

export class Botist {
    private express: express.Express;
    private adaptersList: IAdapter[] = [];
    private beforeSceneList: IMessageMiddleware[] = [];
    private afterSceneList: IMessageMiddleware[] = [];
    private server: http.Server;
    private _mainScene: IScene;
    private currentScene: Map<string, IScene> = new Map();
    private catch?: ICatch;

    constructor(options: IOptions) {
        this.express = express();
        this.express.use(express.json());
        this.server = this.express.listen(options.port);
        this.catch = options.catch;

        this._mainScene = new options.scene(this);
    }

    public destructor() {
        this.server.close();
    }

    public adapter(adapter: IAdapter): void {
        debugAdapter('new %s with webhook %s', adapter.name, adapter.webHookPath);
        this.adaptersList.push(adapter);

        adapter.errorHandler = this.onError;

        this.express.post(adapter.webHookPath, this.onAdapterRequest.bind(this, adapter));
    }

    public getAdapter(name: string): IAdapter | null {
        for (const adapter of this.adaptersList) {
            if (adapter.name === name) {
                return adapter;
            }
        }

        return null;
    }

    public scenario(from: IFrom, res: Response, scenario: Scenario, next?: () => void) {
        scenario.enter(this, from, res, this.getCurrentScene(from), next);
    }

    public scene(from: IFrom, res: Response, event: IEvent, scene: IScene) {
        this.getCurrentScene(from).leave(res.msg, res, event);
        scene.enter(res.msg, res, event);
        this.currentScene.set(this.getSceneKey(from), scene);
    }

    public mainScene(from: IFrom, res: Response, event: IEvent) {
        this.scene(from, res, event, this._mainScene);
    }

    public beforeScene(middleware: IMessageMiddleware) {
        this.beforeSceneList.push(middleware);
    }

    public afterScene(middleware: IMessageMiddleware) {
        this.afterSceneList.push(middleware);
    }

    private async onAdapterRequest(adapter: IAdapter, req: express.Request, res: express.Response) {
        const messages = adapter.onRequest(req, res);
        debugAdapter('%s requested %O', adapter.name, messages);

        messages: for (const baseMsg of messages) {
            const msg: IMessage = baseMsg as IMessage;
            msg.name = adapter.constructor.name;

            const currentScene = this.getCurrentScene(msg);
            for (const middleware of [...this.beforeSceneList, currentScene, ...this.afterSceneList]) {
                if (!middleware.guard(currentScene, msg)) {
                    continue;
                }

                await middleware.onMessage(adapter, currentScene, msg);
                if (!middleware.continue()) {
                    continue messages;
                }
            }
        }
    }

    @bind
    private onError(err: SendError): Promise<IError> {
        if (this.catch) {
            this.catch(err);
            return Promise.resolve(null);
        }

        return Promise.reject(err);
    }

    private getSceneKey(from: IFrom): string {
        return from.name + from.chatId;
    }

    private getCurrentScene(from: IFrom): IScene {
        const key = this.getSceneKey(from);
        const currentScene = this.currentScene.get(key);
        if (currentScene) {
            return currentScene;
        }

        this.currentScene.set(key, this._mainScene);
        return this._mainScene;
    }
}
