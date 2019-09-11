import express = require('express');
import { AppRouter } from './api/routes/app.routes';
import { Container } from 'inversify';
import { DocumentDBService, IDocumentDBService, IDocumentDBServiceType } from './api/services/documentdb/documentdb.service';
import { UserService, IUserService, IUserServiceType } from './api/services/user/user.service';
import { ChargifyService, IChargifyService, IChargifyServiceType } from './api/services/chargify/chargify.service';
import { TokenService, ITokenService, ITokenServiceType } from './api/services/token/token.service';

// Bind Dependency Injection Interfaces to Classes
const AppIoC = new Container();
AppIoC.bind<IDocumentDBService>(IDocumentDBServiceType).to(DocumentDBService);
AppIoC.bind<IUserService>(IUserServiceType).to(UserService);
AppIoC.bind<IChargifyService>(IChargifyServiceType).to(ChargifyService);
AppIoC.bind<ITokenService>(ITokenServiceType).to(TokenService);

export class App {
    public expressRouter = express.Router();
    private appRouter: AppRouter;

    constructor() {
        // Dependency Injection Resolution, only resolve what's needed directly in API Controllers
        const userService = AppIoC.get<IUserService>(IUserServiceType);
        const chargifyService = AppIoC.get<IChargifyService>(IChargifyServiceType);
        const tokenService = AppIoC.get<ITokenService>(ITokenServiceType);

        // Create App Router w/ All Dependencies
        this.appRouter = new AppRouter(userService, chargifyService, tokenService);

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