"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_routes_1 = require("./login/login.routes");
const token_routes_1 = require("./token/token.routes");
class AppRouter {
    constructor(userService, chargifyService, tokenService) {
        this.userService = userService;
        this.chargifyService = chargifyService;
        this.tokenService = tokenService;
        this.routes = [
            ...(new login_routes_1.LoginRouter(this.userService, this.chargifyService)).routes,
            ...(new token_routes_1.TokenRouter(this.tokenService)).routes
        ];
    }
}
exports.AppRouter = AppRouter;
