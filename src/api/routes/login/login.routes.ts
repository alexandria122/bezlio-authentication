import { LoginController } from '../../controllers/login/login.controller';
import { Route } from '../../models/route/route.model';
import { IUserService } from '../../../api/services/user/user.service';
import { IChargifyService } from '../../../api/services/chargify/chargify.service';
import { HttpRequest } from '../../models/httprequest/httprequest.model';
import { HttpResponse } from '../../models/httpresponse/httpresponse.model';

export class LoginRouter {
    public routes: Route[];

    constructor(
        private userService: IUserService,
        private chargifyService: IChargifyService
    ) {
        var thisObj = this;
        this.routes = [
            new Route('/login', 'post', async function(req, res, next) {    
                await (new LoginController(thisObj.userService, thisObj.chargifyService)).login(new HttpRequest(req), new HttpResponse(res));
            })
        ];
    }
}