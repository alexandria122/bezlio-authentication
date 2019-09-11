import { TokenController } from '../../controllers/token/token.controller';
import { Route } from '../../models/route/route.model';
import { ITokenService } from '../../../api/services/token/token.service';
import { HttpRequest } from '../../models/httprequest/httprequest.model';
import { HttpResponse } from '../../models/httpresponse/httpresponse.model';

export class TokenRouter {
    public routes: Route[];

    constructor(
        private tokenService: ITokenService
    ) {
        var thisObj = this;
        this.routes = [
            new Route('/decodeJWTToken', 'post', async function(req, res, next) {    
                await (new TokenController(thisObj.tokenService)).decodeJWTToken(new HttpRequest(req), new HttpResponse(res));
            })
        ];
    }
}