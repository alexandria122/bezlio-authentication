"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class LoginController {
    constructor(userService, chargifyService) {
        this.userService = userService;
        this.chargifyService = chargifyService;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var body = req.body;
                if (body) {
                    var token = yield this.userService.validateUserLogin(body.username, body.password, body.rememberUser);
                    if (!token || token.length == 0) {
                        res.sendUnauthorizedError('Incorrect Password');
                    }
                    // Find user account
                    var user = yield this.userService.getUserByJwtToken(token);
                    if (!user.active) {
                        res.sendUnauthorizedError('Account is Not Activated');
                    }
                    // Check Chargify subscriptions
                    var subscriptions = yield this.chargifyService.getSubscriptionListForCustomer(user.customerId);
                    if (subscriptions && subscriptions.length > 0) {
                        for (var s of subscriptions) {
                            if (s.state == 'canceled') {
                                res.sendUnauthorizedError('Account Canceled');
                            }
                            else if (s.state == 'expired') {
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
                    }
                    else {
                        throw null;
                    }
                    // Valid account and valid subscription found
                    res.sendResponse(token);
                }
                else {
                    res.sendInternalServerError('Error Parsing Request Body');
                }
            }
            catch (e) {
                res.sendUnauthorizedError('Username Does Not Exist');
            }
        });
    }
}
exports.LoginController = LoginController;
