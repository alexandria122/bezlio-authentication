import { HttpRequest } from '../../models/httprequest/httprequest.model';
import { HttpResponse } from '../../models/httpresponse/httpresponse.model';
import { ITokenService } from '../../services/token/token.service';
import { inject } from 'inversify';

export class TokenController {
    constructor(
        private tokenService: ITokenService
    ) {}

    async decodeJWTToken(req: HttpRequest, res: HttpResponse) {
        try {
            var body = req.body;
            if (body) {
                var jwt = await this.tokenService.decodeJwtToken(body.token);
                res.sendResponse(jwt);
            } else {
                res.sendInternalServerError('Error Parsing Request Body');
            }
        } catch(e) {
            res.sendUnauthorizedError('Invalid token request');
        }
    }
}