"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bind_decorator_1 = require("bind-decorator");
const createDebug = require("debug");
const debugAdapter = createDebug('botist:adapter');
class Botist {
    constructor(options) {
        this.adaptersList = [];
        this.beforeSceneList = [];
        this.afterSceneList = [];
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
        this.express.post(adapter.webHookPath, this.onAdapterRequest.bind(this, adapter));
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
    beforeScene(middleware) {
        this.beforeSceneList.push(middleware);
    }
    afterScene(middleware) {
        this.afterSceneList.push(middleware);
    }
    onAdapterRequest(adapter, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = adapter.onRequest(req, res);
            debugAdapter('%s requested %O', adapter.name, messages);
            messages: for (const baseMsg of messages) {
                const msg = baseMsg;
                msg.name = adapter.constructor.name;
                const currentScene = this.getCurrentScene(msg);
                for (const middleware of [...this.beforeSceneList, currentScene, ...this.afterSceneList]) {
                    if (!middleware.guard(currentScene, msg)) {
                        continue;
                    }
                    yield middleware.onMessage(adapter, currentScene, msg);
                    if (!middleware.continue()) {
                        continue messages;
                    }
                }
            }
        });
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