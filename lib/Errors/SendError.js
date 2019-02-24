"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SendError extends Error {
    constructor(err) {
        super(`${err.adapter} with ${err.type} ${err.statusCode}. ${err.text}`);
        this.adapter = err.adapter;
        this.type = err.type;
        this.code = err.code;
        this.text = err.text;
        this.statusCode = err.statusCode;
    }
}
exports.default = SendError;
//# sourceMappingURL=SendError.js.map