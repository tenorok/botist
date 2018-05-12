import http = require('http');
import request = require('request');

// node_modules/@types/request-promise-native/index.d.ts
interface IError {
    name: string;
    statusCode: number;
    message: string;
    error: any;
    options: request.Options;
    response: http.IncomingMessage;
}

export as namespace requestPromise;
