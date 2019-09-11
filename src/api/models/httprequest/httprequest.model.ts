var jsonBody = require('body/json');

export class HttpRequest {
    private _request: any;
    // private _err: any;

    constructor(req: any) {
        this._request = req;
    }

    get headers(): any {
        return this._request.headers;
    }

    get method(): any {
        return this._request.method;
    }

    get url(): any {
        return this._request.url;
    }

    get body(): any {
        return this._request.body;
    }

    // get error(): any {
    //     return this._err;
    // }

    // set error(value) {
    //     this._err = JSON.stringify(value);
    // }
}