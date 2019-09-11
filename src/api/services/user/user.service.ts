var bcrypt = require('bcrypt');
import { inject } from 'inversify';
import { IDocumentDBService, IDocumentDBServiceType } from '../../../api/services/documentdb/documentdb.service';
import { ITokenService, ITokenServiceType } from '../../../api/services/token/token.service';
import { injectable } from 'inversify';

@injectable()
export class UserService implements IUserService {
    private documentDBService: IDocumentDBService;
    private tokenService: ITokenService;

    constructor(
        @inject(IDocumentDBServiceType) documentDBService: IDocumentDBService,
        @inject(ITokenServiceType) tokenService: ITokenService
    ) {
        this.documentDBService = documentDBService;
        this.tokenService = tokenService;
    }

    async validateUserLogin(username: string, password: string, rememberUser?: boolean): Promise<string> {
        var login = await this.documentDBService.getLoginDocumentById(username);

        if (!login) return '';
        if (!(await bcrypt.compare(password, login.password))) return '';

        return await this.tokenService.generateJwtToken(username, login.docUserLink, login.custId, (rememberUser ? rememberUser : false));
    }

    async getUserByJwtToken(token: string) {
        var jwt = await this.tokenService.decodeJwtToken(token);
        if (!jwt) throw 'Invalid token';

        var user;
        try {
            user = await this.documentDBService.getUserDocumentById(jwt.sub, jwt.did);
        } catch (e) {
            if (e == 'User permission missing') {
                try {
                    await this.documentDBService.addPermissionForUser(jwt.sub, jwt.did, false);
                } catch (e2) {
                    throw e;
                }
            } else {
                throw e;
            }
        }

        return user;
    }
}

export interface IUserService {
    validateUserLogin(username: string, password: string, rememberUser?: boolean): Promise<string>;
    getUserByJwtToken(token: string): any
}
export const IUserServiceType = Symbol('IUserService');