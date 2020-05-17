"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SubscriberContext {
    constructor(scene, msg) {
        this.scene = scene;
        this.msg = msg;
    }
    static isTextSubscriber(subscriber) {
        return subscriber.options.type === 'text';
    }
    getSceneSubscribers(filter) {
        const list = [];
        list.push(...this.scene.subscribers.text, ...this.scene.subscribers.image);
        if (filter) {
            const filteredList = [];
            for (const subscriber of list) {
                if (filter.call(null, subscriber)) {
                    filteredList.push(subscriber);
                }
            }
            return filteredList;
        }
        return list;
    }
    match(subscriber) {
        if (this.msg.type === 'text' && SubscriberContext.isTextSubscriber(subscriber) &&
            (typeof subscriber.text === 'string' && this.msg.text === subscriber.text ||
                subscriber.text instanceof RegExp && this.msg.text.match(subscriber.text))) {
            return true;
        }
        return false;
    }
}
exports.SubscriberContext = SubscriberContext;
//# sourceMappingURL=SubscriberContext.js.map