"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const request = require("request-promise-native");
const SendError_1 = require("../Errors/SendError");
class Telegram {
    constructor(token, webHookUrl) {
        this.webHookUrl = webHookUrl;
        this.name = Telegram.name;
        this.apiUrl = Telegram.apiHost + '/bot' + token + '/';
        this.setWebHook();
    }
    get webHookPath() {
        return new url_1.URL(this.webHookUrl).pathname;
    }
    set errorHandler(handler) {
        this._errorHandler = handler;
    }
    onRequest(req, res) {
        const { message } = req.body;
        res.sendStatus(200);
        if (message) {
            if (message.text) {
                const textMessage = {
                    type: 'text',
                    chatId: String(message.chat.id),
                    timestamp: message.date,
                    text: message.text,
                };
                if (message.from && message.from.language_code) {
                    textMessage.language = message.from.language_code;
                }
                return [textMessage];
            }
        }
        return [];
    }
    sendText(id, text, options = {}) {
        return this._sendText(Object.assign({ id,
            text }, options));
    }
    sendMarkdown(id, markdown, options = {}) {
        return this._sendText(Object.assign({ id, text: markdown, parseMode: 'Markdown' }, options));
    }
    _sendText(params) {
        if (!params.text) {
            return Promise.resolve({ messageId: '' });
        }
        const json = {
            chat_id: params.id,
            text: params.text,
        };
        if (params.parseMode !== undefined) {
            json.parse_mode = params.parseMode;
        }
        if (params.disableWebPagePreview !== undefined) {
            json.disable_web_page_preview = params.disableWebPagePreview;
        }
        return request.post({
            url: this.apiUrl + 'sendMessage',
            json,
        }).then((res) => {
            return {
                messageId: String(res.result.message_id),
            };
        }).catch((err) => {
            // this._errorHandler always set when adapter added.
            return this._errorHandler(new SendError_1.default({
                adapter: Telegram.name,
                type: err.name,
                code: err.error.error_code,
                text: err.error.description,
                statusCode: err.statusCode,
            }));
        });
    }
    setWebHook() {
        return request.post({
            url: this.apiUrl + 'setWebHook',
            qs: {
                url: this.webHookUrl,
            },
        }).catch((err) => {
            try {
                const error = JSON.parse(err.error);
                console.error(`${Telegram.name}: Failed to set webhook.`, {
                    type: err.name,
                    code: error.error_code,
                    message: error.description,
                    statusCode: err.statusCode,
                });
            }
            catch (errParse) {
                console.error(`${Telegram.name}: Failed to set webhook`, err.error);
            }
        });
    }
}
Telegram.apiHost = 'https://api.telegram.org';
exports.Telegram = Telegram;
//# sourceMappingURL=Adapter.js.map