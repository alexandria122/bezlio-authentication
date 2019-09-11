import { LoginRouter } from './login/login.routes';
import { TokenRouter } from './token/token.routes';
import { Route } from './../models/route/route.model';
import { IUserService } from '../../api/services/user/user.service';
import { IChargifyService } from '../../api/services/chargify/chargify.service';
import { ITokenService } from '../../api/services/token/token.service';

export class AppRouter {
    public routes: Route[];

    constructor(
        private userService: IUserService,
        private chargifyService: IChargifyService,
        private tokenService: ITokenService
    ) {
        this.routes = [
            ...( new LoginRouter(this.userService, this.chargifyService)).routes,
            ...( new TokenRouter(this.tokenService)).routes
        ];
    }
}
