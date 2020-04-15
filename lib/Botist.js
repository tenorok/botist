"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bind_decorator_1 = require("bind-decorator");
const createDebug = require("debug");
const debugAdapter = createDebug('botist:adapter');
class Botist {
    constructor(options) {
        this.adaptersList = [];
        this.currentScene = new Map();
        this.express = express();
        this.express.use(express.json());
        this.server = this.express.listen(options.port);
        this.catch = options.catch;
        this._mainScene = new options.scene(this);
    }
    destructor() {
        this.server.close();
    }
    adapter(adapter) {
        debugAdapter('new %s with webhook %s', adapter.name, adapter.webHookPath);
        this.adaptersList.push(adapter);
        adapter.errorHandler = this.onError;
        this.express.post(adapter.webHookPath, (req, res) => {
            const messages = adapter.onRequest(req, res);
            debugAdapter('%s requested %O', adapter.name, messages);
            for (const baseMsg of messages) {
                const msg = baseMsg;
                msg.name = adapter.constructor.name;
                this.getCurrentScene(msg).onMessage(adapter, msg);
            }
        });
    }
    getAdapter(name) {
        for (const adapter of this.adaptersList) {
            if (adapter.name === name) {
                return adapter;
            }
        }
        return null;
    }
    scenario(from, res, scenario, next) {
        scenario.enter(this, from, res, this.getCurrentScene(from), next);
    }
    scene(from, res, event, scene) {
        this.getCurrentScene(from).leave(res.msg, res, event);
        scene.enter(res.msg, res, event);
        this.currentScene.set(this.getSceneKey(from), scene);
    }
    mainScene(from, res, event) {
        this.scene(from, res, event, this._mainScene);
    }
    onError(err) {
        if (this.catch) {
            this.catch(err);
            return Promise.resolve(null);
        }
        return Promise.reject(err);
    }
    getSceneKey(from) {
        return from.name + from.chatId;
    }
    getCurrentScene(from) {
        const key = this.getSceneKey(from);
        const currentScene = this.currentScene.get(key);
        if (currentScene) {
            return currentScene;
        }
        this.currentScene.set(key, this._mainScene);
        return this._mainScene;
    }
}
__decorate([
    bind_decorator_1.default
], Botist.prototype, "onError", null);
exports.Botist = Botist;
//# sourceMappingURL=Botist.js.map