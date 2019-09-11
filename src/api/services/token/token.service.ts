var jwt = require('jsonwebtoken');
var config = require('../../../app.config.js');
import { injectable } from 'inversify';

@injectable()
export class TokenService implements ITokenService {
    async generateJwtToken(username: string, docUserLink: string, customerId: number, rememberUser: boolean): Promise<string> {
        var hours: number = 8;
        if (rememberUser) { hours = 60 * 24; }

        var tokenExp: number = hours > 0 ? (Date.now() + (hours * 60 * 60 * 1000)) / 1000 : hours;
        var tokenData: {} = { sub : username, exp : tokenExp, did : docUserLink, custId : customerId };
        var options: {} = { algorithm : 'HS512', header : { sub : username, exp : tokenExp }};

        return new Promise<string>((resolve, reject) => {
            jwt.sign(tokenData, config.jwt, options, function(err, token) {
                if (err) { reject(err); }
                else { resolve(token); }
            });
        });
    }

    async decodeJwtToken(token: string): Promise<any> {
        var options: {} = { algorithms : ['HS512'] };

        return new Promise((resolve, reject) => {
            jwt.verify(token, config.jwt, options, function(err, decoded) {
                if (err) { resolve(null); }
                else { resolve(decoded); }
            });
        });
    }
}

export interface ITokenService {
    generateJwtToken(username: string, docUserLink: string, customerId: number, rememberUser: boolean): Promise<string>;
    decodeJwtToken(token: string): Promise<any>;
}
export const ITokenServiceType = Symbol('ITokenService');