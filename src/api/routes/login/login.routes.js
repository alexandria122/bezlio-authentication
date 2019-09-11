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
const login_controller_1 = require("../../controllers/login/login.controller");
const route_model_1 = require("../../models/route/route.model");
const httprequest_model_1 = require("../../models/httprequest/httprequest.model");
const httpresponse_model_1 = require("../../models/httpresponse/httpresponse.model");
class LoginRouter {
    constructor(userService, chargifyService) {
        this.userService = userService;
        this.chargifyService = chargifyService;
        var thisObj = this;
        this.routes = [
            new route_model_1.Route('/login', 'post', function (req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield (new login_controller_1.LoginController(thisObj.userService, thisObj.chargifyService)).login(new httprequest_model_1.HttpRequest(req), new httpresponse_model_1.HttpResponse(res));
                });
            })
        ];
    }
}
exports.LoginRouter = LoginRouter;
