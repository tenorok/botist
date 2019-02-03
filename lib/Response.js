"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(botist, id, adapter) {
        this.botist = botist;
        this.id = id;
        this.adapter = adapter;
        this.from = {
            name: adapter.name,
            chatId: id,
        };
    }
    sendText(text, options) {
        return this.adapter.sendText(this.id, text, options);
    }
    sendMarkdown(markdown, options) {
        return this.adapter.sendMarkdown(this.id, markdown, options);
    }
    /**
     * Start a scenario.
     */
    scenario(scenario, next) {
        this.botist.scenario(this.from, this, scenario, next);
    }
}
exports.Response = Response;
//# sourceMappingURL=Response.js.map