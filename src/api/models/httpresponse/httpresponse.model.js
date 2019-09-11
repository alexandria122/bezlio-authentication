"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpResponse {
    constructor(res) {
        this._response = res;
    }
    sendResponse(message) {
        this.sendMessageWithStatusCode(200, message);
    }
    sendInternalServerError(error) {
        this.sendMessageWithStatusCode(500, error);
    }
    sendUnauthorizedError(error) {
        this.sendMessageWithStatusCode(401, error);
    }
    sendForbiddenAccessError(error) {
        this.sendMessageWithStatusCode(403, error);
    }
    send400Error(error) {
        this.sendMessageWithStatusCode(400, error);
    }
    sendMessageWithStatusCode(code, message) {
        this._response.statusCode = code;
        if (typeof message !== 'string') {
            this._response.setHeader("content-type", "application/json");
            message = JSON.stringify(message);
        }
        else {
            try {
                message = JSON.parse(message);
                // This will only execute if the above line didn't throw an exception, making it a valid JSON response
                this._response.setHeader("content-type", "application/json");
                message = JSON.stringify(message);
            }
            catch (e) { }
        }
        this._response.end(message);
    }
}
exports.HttpResponse = HttpResponse;
