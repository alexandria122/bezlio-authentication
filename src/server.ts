import express = require('express');
import "reflect-metadata";
import { App } from './app';

var server = express();
var app = new App();
var bodyParser = require('body-parser');
var compression = require('compression');

server.use(compression());
server.use(bodyParser.json());

server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Accept, Bearer, Origin, Content-type, ConnectionId, ConnectionToken, SessionGUID, ConnectionName, Provider, UserId');
    next();
});
server.use('/', app.expressRouter);

server.get('/', function(req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Authentication Listening");
});

var port: number|string = process.env.PORT || 3002;
server.listen(port, function() {
    console.log('Authentication Listening On ' + port + '...');
});


