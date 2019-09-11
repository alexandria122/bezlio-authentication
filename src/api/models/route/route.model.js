"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Route {
    constructor(_path, _type, _function) {
        this._path = _path;
        this._type = _type;
        this._function = _function;
        this.path = _path;
        this.type = _type;
        this.function = _function;
    }
}
exports.Route = Route;
