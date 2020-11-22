"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = require("../Response");
const Message_t_1 = require("../Message.t");
const SceneContext_1 = require("../SceneContext");
class MessageMiddleware {
    constructor(botist) {
        this.botist = botist;
        this._subscribers = {
            text: [],
            image: [],
            poll: [],
        };
        this.subscribe();
    }
    get subscribers() {
        return this._subscribers;
    }
    text(matcher, callback, options) {
        this.subscriber(Message_t_1.MessageType.text, matcher, callback, options);
    }
    poll(matcher, callback, options) {
        this.subscriber(Message_t_1.MessageType.poll, matcher, callback, options);
    }
    /**
     * Determines the need to applying this middleware for scene and message.
     */
    guard(_scene, _msg) {
        return true;
    }
    /**
     * Determines the need to call handlers of the next middleware.
     */
    continue(_scene, _msg) {
        return true;
    }
    async onMessage(adapter, scene, msg, startSubscriberIndex = 0) {
        const subscribers = this._subscribers[msg.type];
        for (let i = startSubscriberIndex; i < subscribers.length; i++) {
            const ctx = new SceneContext_1.SceneContext(scene, msg);
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
    }
    subscriber(type, matcher, callback, options) {
        const innerOptions = {
            type,
            labels: [],
        };
        if (options && options.labels) {
            innerOptions.labels.push(...options.labels);
        }
        // Subscriber type and information always matched.
        this._subscribers[type].push({
            matcher,
            callback,
            options: innerOptions,
        });
    }
}
exports.MessageMiddleware = MessageMiddleware;
//# sourceMappingURL=Message.js.map