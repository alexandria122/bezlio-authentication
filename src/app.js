"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app_routes_1 = require("./api/routes/app.routes");
const inversify_1 = require("inversify");
const documentdb_service_1 = require("./api/services/documentdb/documentdb.service");
const user_service_1 = require("./api/services/user/user.service");
const chargify_service_1 = require("./api/services/chargify/chargify.service");
const token_service_1 = require("./api/services/token/token.service");
// Bind Dependency Injection Interfaces to Classes
const AppIoC = new inversify_1.Container();
AppIoC.bind(documentdb_service_1.IDocumentDBServiceType).to(documentdb_service_1.DocumentDBService);
AppIoC.bind(user_service_1.IUserServiceType).to(user_service_1.UserService);
AppIoC.bind(chargify_service_1.IChargifyServiceType).to(chargify_service_1.ChargifyService);
AppIoC.bind(token_service_1.ITokenServiceType).to(token_service_1.TokenService);
class App {
    constructor() {
        this.expressRouter = express.Router();
        // Dependency Injection Resolution, only resolve what's needed directly in API Controllers
        const userService = AppIoC.get(user_service_1.IUserServiceType);
        const chargifyService = AppIoC.get(chargify_service_1.IChargifyServiceType);
        const tokenService = AppIoC.get(token_service_1.ITokenServiceType);
        // Create App Router w/ All Dependencies
        this.appRouter = new app_routes_1.AppRouter(userService, chargifyService, tokenService);
        // Define Express Router Actions
        this.appRouter.routes.forEach(route => {
            switch (route.type) {
                case 'post': {
                    this.expressRouter.post(route.path, route.function);
                    break;
                }
                case 'get': {
                    this.expressRouter.get(route.path, route.function);
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }
}
exports.App = App;
