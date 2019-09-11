export class Route {
    path: string;
    type: string;
    function: any;

    constructor(private _path: string, private _type: string, private _function: any) {
        this.path = _path;
        this.type = _type;
        this.function = _function;
    }
}