"use strict";
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
const Response_1 = require("../Response");
const SubscriberContext_1 = require("../SubscriberContext");
class MessageMiddleware {
    constructor(botist) {
        this.botist = botist;
        this._subscribers = {
            text: [],
            image: [],
        };
        this.subscribe();
    }
    text(text, callback, options) {
        const innerOptions = {
            type: 'text',
            labels: [],
        };
        if (options && options.labels) {
            innerOptions.labels.push(...options.labels);
        }
        this._subscribers.text.push({
            text,
            callback,
            options: innerOptions,
        });
    }
    /**
     * Determines the need to applying middleware for scene and message.
     */
    guard(_scene, _msg) {
        return true;
    }
    /**
     * Determines the need to call the handlers of the next middleware.
     */
    continue() {
        return true;
    }
    onMessage(adapter, scene, msg, startSubscriberIndex = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscribers = this._subscribers[msg.type];
            for (let i = startSubscriberIndex; i < subscribers.length; i++) {
                const ctx = new SubscriberContext_1.SubscriberContext(scene, msg);
                const subscriber = subscribers[i];
                if (!ctx.match(subscriber)) {
                    continue;
                }
                const res = new Response_1.Response(this.botist, adapter, msg);
                // If subscriber matched to message then their types are equal.
                return subscriber.callback.call(ctx, msg, res, () => {
                    return this.onMessage(adapter, scene, msg, i + 1);
                });
            }
        });
    }
}
exports.MessageMiddleware = MessageMiddleware;
//# sourceMappingURL=Message.js.map