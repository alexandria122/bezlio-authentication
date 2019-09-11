import { HttpRequest } from '../../models/httprequest/httprequest.model';
import { HttpResponse } from '../../models/httpresponse/httpresponse.model';
import { IUserService } from '../../services/user/user.service';
import { IChargifyService } from '../../services/chargify/chargify.service';
import { inject } from 'inversify';

export class LoginController {
    constructor(
        private userService: IUserService,
        private chargifyService: IChargifyService
    ) {}

    async login(req: HttpRequest, res: HttpResponse) {
        try {
            var body = req.body;
            if (body) {
                var token = await this.userService.validateUserLogin(body.username, body.password, body.rememberUser);
                if (!token || token.length == 0) { res.sendUnauthorizedError('Incorrect Password'); }
                
                // Find user account
                var user = await this.userService.getUserByJwtToken(token);
                if (!user.active) {
                    res.sendUnauthorizedError('Account is Not Activated');
                }

                // Check Chargify subscriptions
                var subscriptions = await this.chargifyService.getSubscriptionListForCustomer(user.customerId);
                if (subscriptions && subscriptions.length > 0) {
                    for (var s of subscriptions) {
                        if(s.state == 'canceled') {
                            res.sendUnauthorizedError('Account Canceled');
                        }
                        else if(s.state == 'expired') {
                            res.sendUnauthorizedError('Account Expired');
                        }
                        else if (s.state == 'on_hold') {
                            res.sendUnauthorizedError('Account On Hold');
                        }
                        else if (s.state == 'trial_ended') {
                            res.sendUnauthorizedError('Trial Ended');
                        }
                        else if (s.state == 'failed_to_create') {
                            res.sendUnauthorizedError('Account Failed to Create');
                        }
                        else if (s.state == 'suspended') {
                            res.sendUnauthorizedError('Account Suspended');
                        }
                    }
                } else { throw null; }
                

                // Valid account and valid subscription found
                res.sendResponse(token);
            } else {
                res.sendInternalServerError('Error Parsing Request Body');
            }
        } catch(e) {
            res.sendUnauthorizedError('Username Does Not Exist');
        }
    }
}