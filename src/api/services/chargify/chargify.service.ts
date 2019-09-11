var config = require('../../../app.config');
import { inject } from 'inversify';
import { injectable } from 'inversify';
import { ChargifyAPI } from './chargify.node';

@injectable()
export class ChargifyService implements IChargifyService {

    async getSubscriptionListForCustomer(custId: number) {
        return await this.getChargifyResource('/customers/' + custId + '/subscriptions');
    }

    // Private
    private getChargifyResource(resource: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                ChargifyAPI.request({
                    subdomain: config.chargifySubdomain,
                    api_key: config.chargifyApiKey,
                    resource: resource,
                    method: 'GET'
                }, function (err, response, body) {
                    if (err) { reject(err); }
                    else if (response.statusCode == 404) { reject('Document Not Found'); }
                    else if (response.statusCode >= 400) { reject(response.statusCode.toString()); }
                    else { resolve(body); }
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}

export interface IChargifyService {
    getSubscriptionListForCustomer(custId: number): Promise<any>;
}
export const IChargifyServiceType = Symbol('IChargifyService');