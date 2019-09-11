"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonBody = require('body/json');
class HttpRequest {
    // private _body: string;
    // private _headers: any;
    // private _method: any;
    // private _url: any;
    // private _err: any;
    constructor(req) {
        this._request = req;
        // const { headers, method, url } = this._request;
        // this._headers = headers;
        // this._method = method;
        // this._url = url;
    }
    get headers() {
        return this._request.headers;
    }
    get method() {
        return this._request.method;
    }
    get url() {
        return this._request.url;
    }
    get body() {
        return this._request.body;
    }
}
exports.HttpRequest = HttpRequest;
