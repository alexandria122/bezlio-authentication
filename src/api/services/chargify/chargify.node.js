"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
/*
Copyright (c) 2015, Munjal Patel <munjal@munpat.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
class ChargifyAPI {
    static request(options, callback) {
        if (!options)
            throw new Error('No options specified');
        if (!options.resource)
            throw new Error('No resource specified');
        if (!options.method)
            throw new Error('No method specified');
        if (!options.resource)
            throw new Error('No resource specified');
        if (!options.method)
            throw new Error('No method specified');
        switch (options.method) {
            case 'GET':
            case 'POST':
            case 'PUT':
            case 'DELETE':
                break;
            default:
                throw new Error('Invalid method. Supported methods are: GET, POST, PUT, DELETE');
        }
        if (options.resource.indexOf('.json') === -1)
            options.resource += '.json';
        var payload = {
            url: 'https://' + options.api_key + ':x@' + options.subdomain + '.chargify.com/' + options.resource,
            json: true,
            method: options.method,
            body: ''
        };
        if (options.method === 'POST' || options.method === 'PUT')
            payload.body = options.body;
        request(payload, function (err, res, body) {
            callback(err, res, body);
        });
    }
}
exports.ChargifyAPI = ChargifyAPI;
