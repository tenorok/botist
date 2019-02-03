"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = require("./Response");
class MainScene {
    constructor(botist) {
        this.botist = botist;
        this.messageHandlers = {
            text: [],
            image: [],
        };
        this.subscribe();
    }
    /**
     * Called when scene is activating.
     */
    enter(_) { }
    /**
     * Called when scene is deactivating.
     */
    leave(_) { }
    text(text, callback) {
        this.messageHandlers.text.push({
            text,
            callback,
        });
    }
    onMessage(adapter, msg, startHandlerIndex = 0) {
        for (let i = startHandlerIndex; i < this.messageHandlers[msg.type].length; i++) {
            const handler = this.messageHandlers[msg.type][i];
            if (msg.type === 'text') {
                const handlerText = handler.text;
                if (typeof handlerText === 'string' && msg.text !== handlerText ||
                    handlerText instanceof RegExp && !msg.text.match(handlerText)) {
                    continue;
                }
            }
            const res = new Response_1.Response(this.botist, msg.chatId, adapter);
            handler.callback.call(null, msg, res, () => {
                this.onMessage(adapter, msg, i + 1);
            });
            break;
        }
    }
}
exports.MainScene = MainScene;
//# sourceMappingURL=MainScene.js.map