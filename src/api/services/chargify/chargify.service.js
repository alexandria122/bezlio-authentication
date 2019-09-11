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
var config = require('../../../app.config');
const inversify_1 = require("inversify");
const chargify_node_1 = require("./chargify.node");
let ChargifyService = class ChargifyService {
    getSubscriptionListForCustomer(custId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getChargifyResource('/customers/' + custId + '/subscriptions');
        });
    }
    // Private
    getChargifyResource(resource) {
        return new Promise((resolve, reject) => {
            try {
                chargify_node_1.ChargifyAPI.request({
                    subdomain: config.chargifySubdomain,
                    api_key: config.chargifyApiKey,
                    resource: resource,
                    method: 'GET'
                }, function (err, response, body) {
                    if (err) {
                        reject(err);
                    }
                    else if (response.statusCode == 404) {
                        reject('Document Not Found');
                    }
                    else if (response.statusCode >= 400) {
                        reject(response.statusCode.toString());
                    }
                    else {
                        resolve(body);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
};
ChargifyService = __decorate([
    inversify_1.injectable()
], ChargifyService);
exports.ChargifyService = ChargifyService;
exports.IChargifyServiceType = Symbol('IChargifyService');
