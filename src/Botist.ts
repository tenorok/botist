import * as http from 'http';
import express = require('express');
import {
    IBaseMessage,
    IMessage,
} from './Message.t';
import { IMainScene } from './MainScene';
import { Scenario } from './Scenario';

export interface IAdapter {
    readonly webHookPath: string;
    onRequest(req: express.Request, res: express.Response): IBaseMessage[];
    sendText(id: string, text: string): Promise<IResponse | IError>;
}

export interface IOptions {
    port: number;
    scene: new (botist: Botist) => IMainScene;
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

export class Botist {
    private express: express.Express;
    private adaptersList: IAdapter[] = [];
    private server: http.Server;
    private _mainScene: IMainScene;
    private currentScene: IMainScene;

    constructor(options: IOptions) {
        this.express = express();
        this.express.use(express.json());
        this.server = this.express.listen(options.port);

        this._mainScene = new options.scene(this);
        this.currentScene = this._mainScene;
    }

    public destructor() {
        this.server.close();
    }

    public adapter(adapter: IAdapter): void {
        this.adaptersList.push(adapter);
        this.express.post(adapter.webHookPath, (req, res) => {
            const messages = adapter.onRequest(req, res);
            for (const baseMsg of messages) {
                const msg: IMessage = baseMsg as IMessage;
                msg.name = adapter.constructor.name;
                this.currentScene.onMessage(adapter, msg);
            }
        });
    }

    public scenario(scenario: Scenario) {
        scenario.enter(this);
    }

    public scene(scene: IMainScene) {
        this.currentScene.leave();
        scene.enter();
        this.currentScene = scene;
    }

    public mainScene() {
        this.scene(this._mainScene);
    }
}
