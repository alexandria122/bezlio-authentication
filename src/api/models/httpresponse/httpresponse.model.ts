export class HttpResponse {
    private _response: any;

    constructor(res: any) {
        this._response = res;
    }

    sendResponse(message: string | Object) {
        this.sendMessageWithStatusCode(200, message);
    }

    sendInternalServerError(error: string | Object) {
        this.sendMessageWithStatusCode(500, error);
    }

    sendUnauthorizedError(error: string | Object) {
        this.sendMessageWithStatusCode(401, error);
    }

    sendForbiddenAccessError(error: string | Object) {
        this.sendMessageWithStatusCode(403, error);
    }

    send400Error(error: string | Object) {
        this.sendMessageWithStatusCode(400, error);
    }

    private sendMessageWithStatusCode(code: number, message: string | Object) {
        this._response.statusCode = code;
        if (typeof message !== 'string') {
            this._response.setHeader('content-type', 'application/json');
            message = JSON.stringify(message);
        }  
        else {
            try {
                message = JSON.parse(message);
                // This will only execute if the above line didn't throw an exception, making it a valid JSON response
                this._response.setHeader('content-type', 'application/json');
                message = JSON.stringify(message);
            } catch (e) {}
        }
        this._response.end(message);
    }
}