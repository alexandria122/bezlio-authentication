"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require('bcrypt');
const inversify_1 = require("inversify");
const documentdb_service_1 = require("../../../api/services/documentdb/documentdb.service");
const token_service_1 = require("../../../api/services/token/token.service");
const inversify_2 = require("inversify");
let UserService = class UserService {
    constructor(documentDBService, tokenService) {
        this.documentDBService = documentDBService;
        this.tokenService = tokenService;
    }
    validateUserLogin(username, password, rememberUser) {
        return __awaiter(this, void 0, void 0, function* () {
            var login = yield this.documentDBService.getLoginDocumentById(username);
            if (!login)
                return '';
            if (!(yield bcrypt.compare(password, login.password)))
                return '';
            return yield this.tokenService.generateJwtToken(username, login.docUserLink, login.custId, (rememberUser ? rememberUser : false));
        });
    }
    getUserByJwtToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            var jwt = yield this.tokenService.decodeJwtToken(token);
            if (!jwt)
                throw 'Invalid token';
            var user;
            try {
                user = yield this.documentDBService.getUserDocumentById(jwt.sub, jwt.did);
            }
            catch (e) {
                if (e == 'User permission missing') {
                    try {
                        yield this.documentDBService.addPermissionForUser(jwt.sub, jwt.did, false);
                    }
                    catch (e2) {
                        throw e;
                    }
                }
                else {
                    throw e;
                }
            }
            return user;
        });
    }
};
UserService = __decorate([
    inversify_2.injectable(),
    __param(0, inversify_1.inject(documentdb_service_1.IDocumentDBServiceType)),
    __param(1, inversify_1.inject(token_service_1.ITokenServiceType)),
    __metadata("design:paramtypes", [Object, Object])
], UserService);
exports.UserService = UserService;
exports.IUserServiceType = Symbol('IUserService');
