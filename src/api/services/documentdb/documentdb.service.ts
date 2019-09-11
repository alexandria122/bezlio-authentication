// Version 1.0.0

'use strict';

// var documentClient = require('documentdb').DocumentClient;
var documentClient = require("documentdb").DocumentClient;
var config = require('../../../app.config.js');
var url = require('url');
import { injectable } from 'inversify';

@injectable()
export class DocumentDBService implements IDocumentDBService {
    // DocumentDB URLs
    private databaseUrl = `dbs/${config.docDBdatabase}`;
    private systemCollectionUrl = `${this.databaseUrl}/colls/${config.docDBsystemCollection}`;
    private dataCollectionUrl = `${this.databaseUrl}/colls/${config.docDBdataCollection}`;
    private masterClient;

    private get MasterClient() {
        if (!this.masterClient) {
            this.masterClient = new documentClient(config.docDBendpoint, { "masterKey": config.docDBprimaryKey });
        }

        return this.masterClient;
    }

    private getResourceClient(resources: any[]) {
        var resourceTokens: string[] = [];
        for (let resource of resources) {
            resourceTokens.push(resource._token);
        }

        return new documentClient(config.docDBendpoint, { "masterKey": config.docDBprimaryKey, "resourceTokens": resourceTokens });
    }

    async getUserDocumentById(userId: string, docUserLink: string) {
        var userDocumentId = 'User:' + userId;

        // Check if user has valid permissions
        try {
            var userPerm = await this.getPermissionForUser(userId, docUserLink);
            if (!userPerm) { throw null; }
        } catch (e) {
            throw 'User permission missing';
        }

        // Get user
        try {
            return await this.getDataDocumentById(userDocumentId);
        } catch (e) {
            if (e ==  DocDBStatusCodes.NOTFOUND.message) { throw 'User not found'; }
            else {throw e; }
        }
    }

    async getLoginDocumentById(userId: string) {
        return this.getSystemDocumentById('Login:' + userId);
    }

    async getPermissionForUser(userId: string, docUserLink: string) {
        var thisObj = this;
        var userDocumentId = 'User:' + userId;
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id = @id',
            parameters: [{
                name: '@id',
                value: userDocumentId
            }]
        };

        return new Promise((resolve, reject) => {
            thisObj.MasterClient.queryPermissions(docUserLink, querySpec).toArray(function (err, results) {
                if (err) {
                    resolve(null);
                } else {
                    if (results && results.length > 0) {
                        resolve(results[0]);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    async addPermissionForUser(userId: string, docUserLink: string, checkForExisting: boolean) {
        if (checkForExisting) {
            var userPerm = await this.getPermissionForUser(userId, docUserLink);
            if (userPerm) {
                // Delete existing
                this.MasterClient.deletePermission((<any>userPerm)._self, (err, result) => {}); 
            }
        }

        return new Promise<[any]>((resolve, reject) => {
            var thisObj = this;
            var userDocumentId = 'User:' + userId;
            var body = {
                id: userDocumentId,
                permissionMode: 'All',
                resource: `${thisObj.dataCollectionUrl}/docs/${userDocumentId}`
            };

        
            thisObj.MasterClient.createPermission(docUserLink, body, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    private async getSystemDocumentById(documentId: string) {
        return this.getDocumentById(documentId, this.systemCollectionUrl);
    }

    private async getDataDocumentById(documentId: string) {
        return this.getDocumentById(documentId, this.dataCollectionUrl);
    }

    private async getDocumentById(documentId: string, collectionUrl: string) {
        var documentUrl = `${collectionUrl}/docs/${documentId}`;
        var thisObj = this;
        
        return new Promise((resolve, reject) => {
            thisObj.MasterClient.readDocument(documentUrl, (err, result) => {
                if (err) {
                    if (err.code == DocDBStatusCodes.NOTFOUND.statusCode) {
                        reject( DocDBStatusCodes.NOTFOUND.message);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(result);
                }
            });
        });
    }
}

export interface IDocumentDBService {
    getLoginDocumentById(userId: string): Promise<any>;
    getUserDocumentById(userId: string, docUserLink: string): Promise<any>;
    getPermissionForUser(userId: string, docUserLink: string): Promise<any>;
    addPermissionForUser(userId: string, docUserLink: string, checkForExisting: boolean): Promise<any>;
}
export const IDocumentDBServiceType = Symbol("IDocumentDBService");

class DocDBStatusCodes {
    static NOTFOUND = { statusCode: 404, message: 'Document not found' }
}





