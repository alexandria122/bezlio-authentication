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
class TokenController {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    decodeJWTToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var body = req.body;
                if (body) {
                    var jwt = yield this.tokenService.decodeJwtToken(body.token);
                    res.sendResponse(jwt);
                }
                else {
                    res.sendInternalServerError('Error Parsing Request Body');
                }
            }
            catch (e) {
                res.sendUnauthorizedError('Invalid token request');
            }
        });
    }
}
exports.TokenController = TokenController;
