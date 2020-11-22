"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bind_decorator_1 = require("bind-decorator");
const Message_t_1 = require("./Message.t");
class SceneContext {
    constructor(scene, msg) {
        this.scene = scene;
        this.msg = msg;
    }
    static isTextSubscriber(subscriber) {
        return subscriber.options.type === Message_t_1.MessageType.text;
    }
    static isPollSubscriber(subscriber) {
        return subscriber.options.type === Message_t_1.MessageType.poll;
    }
    getSubscribers() {
        return Object.values(this.scene.subscribers).flat();
    }
    match(subscriber) {
        if (this.msg.type === Message_t_1.MessageType.text && SceneContext.isTextSubscriber(subscriber) &&
            (typeof subscriber.matcher === 'function' && subscriber.matcher.call(this, this.msg) ||
                typeof subscriber.matcher === 'string' && this.msg.text === subscriber.matcher ||
                subscriber.matcher instanceof RegExp && this.msg.text.match(subscriber.matcher))) {
            return true;
        }
        if (this.msg.type === Message_t_1.MessageType.poll && SceneContext.isPollSubscriber(subscriber) &&
            subscriber.matcher.call(this, this.msg)) {
            return true;
        }
        return false;
    }
}
__decorate([
    bind_decorator_1.default
], SceneContext.prototype, "match", null);
exports.SceneContext = SceneContext;
//# sourceMappingURL=SceneContext.js.map