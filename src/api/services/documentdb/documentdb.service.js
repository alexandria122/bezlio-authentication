// Version 1.0.0
'use strict';
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
// var documentClient = require('documentdb').DocumentClient;
var documentClient = require("documentdb").DocumentClient;
var config = require('../../../app.config.js');
var url = require('url');
const inversify_1 = require("inversify");
let DocumentDBService = class DocumentDBService {
    constructor() {
        // DocumentDB URLs
        this.databaseUrl = `dbs/${config.docDBdatabase}`;
        this.systemCollectionUrl = `${this.databaseUrl}/colls/${config.docDBsystemCollection}`;
        this.dataCollectionUrl = `${this.databaseUrl}/colls/${config.docDBdataCollection}`;
    }
    get MasterClient() {
        if (!this.masterClient) {
            this.masterClient = new documentClient(config.docDBendpoint, { "masterKey": config.docDBprimaryKey });
        }
        return this.masterClient;
    }
    getResourceClient(resources) {
        var resourceTokens = [];
        for (let resource of resources) {
            resourceTokens.push(resource._token);
        }
        return new documentClient(config.docDBendpoint, { "masterKey": config.docDBprimaryKey, "resourceTokens": resourceTokens });
    }
    getUserDocumentById(userId, docUserLink) {
        return __awaiter(this, void 0, void 0, function* () {
            var userDocumentId = 'User:' + userId;
            // Check if user has valid permissions
            try {
                var userPerm = yield this.getPermissionForUser(userId, docUserLink);
                if (!userPerm) {
                    throw null;
                }
            }
            catch (e) {
                throw 'User permission missing';
            }
            // Get user
            try {
                return yield this.getDataDocumentById(userDocumentId);
            }
            catch (e) {
                if (e == DocDBStatusCodes.NOTFOUND.message) {
                    throw 'User not found';
                }
                else {
                    throw e;
                }
            }
        });
    }
    getLoginDocumentById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getSystemDocumentById('Login:' + userId);
        });
    }
    getPermissionForUser(userId, docUserLink) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    }
                    else {
                        if (results && results.length > 0) {
                            resolve(results[0]);
                        }
                        else {
                            resolve(null);
                        }
                    }
                });
            });
        });
    }
    addPermissionForUser(userId, docUserLink, checkForExisting) {
        return __awaiter(this, void 0, void 0, function* () {
            if (checkForExisting) {
                var userPerm = yield this.getPermissionForUser(userId, docUserLink);
                if (userPerm) {
                    // Delete existing
                    this.MasterClient.deletePermission(userPerm._self, (err, result) => { });
                }
            }
            return new Promise((resolve, reject) => {
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
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        });
    }
    getSystemDocumentById(documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getDocumentById(documentId, this.systemCollectionUrl);
        });
    }
    getDataDocumentById(documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getDocumentById(documentId, this.dataCollectionUrl);
        });
    }
    getDocumentById(documentId, collectionUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            var documentUrl = `${collectionUrl}/docs/${documentId}`;
            var thisObj = this;
            return new Promise((resolve, reject) => {
                thisObj.MasterClient.readDocument(documentUrl, (err, result) => {
                    if (err) {
                        if (err.code == DocDBStatusCodes.NOTFOUND.statusCode) {
                            reject(DocDBStatusCodes.NOTFOUND.message);
                        }
                        else {
                            reject(err);
                        }
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        });
    }
};
DocumentDBService = __decorate([
    inversify_1.injectable()
], DocumentDBService);
exports.DocumentDBService = DocumentDBService;
exports.IDocumentDBServiceType = Symbol("IDocumentDBService");
class DocDBStatusCodes {
}
DocDBStatusCodes.NOTFOUND = { statusCode: 404, message: 'Document not found' };
