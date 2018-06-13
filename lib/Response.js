"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(id, adapter) {
        this.id = id;
        this.adapter = adapter;
    }
    sendText(text) {
        return this.adapter.sendText(this.id, text);
    }
}
exports.default = Response;
//# sourceMappingURL=Response.js.map