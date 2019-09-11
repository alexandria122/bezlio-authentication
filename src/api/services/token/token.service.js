"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var jwt = require('jsonwebtoken');
var config = require('../../../app.config.js');
const inversify_1 = require("inversify");
let TokenService = class TokenService {
    generateJwtToken(username, docUserLink, customerId, rememberUser) {
        return __awaiter(this, void 0, void 0, function* () {
            var hours = 8;
            if (rememberUser) {
                hours = 60 * 24;
            }
            var tokenExp = hours > 0 ? (Date.now() + (hours * 60 * 60 * 1000)) / 1000 : hours;
            var tokenData = { sub: username, exp: tokenExp, did: docUserLink, custId: customerId };
            var options = { algorithm: 'HS512', header: { sub: username, exp: tokenExp } };
            return new Promise((resolve, reject) => {
                jwt.sign(tokenData, config.jwtTokenSecret, options, function (err, token) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(token);
                    }
                });
            });
        });
    }
    decodeJwtToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            var options = { algorithms: ['HS512'] };
            return new Promise((resolve, reject) => {
                jwt.verify(token, config.jwtTokenSecret, options, function (err, decoded) {
                    if (err) {
                        resolve(null);
                    }
                    else {
                        resolve(decoded);
                    }
                });
            });
        });
    }
};
TokenService = __decorate([
    inversify_1.injectable()
], TokenService);
exports.TokenService = TokenService;
exports.ITokenServiceType = Symbol('ITokenService');
