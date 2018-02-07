'use strict';

const express = require('express');
const config = require('config');
const logger = require('logger');
const api = require('api');
const client = require('client');

const server = express();

server.use(config.client.path, client);
server.use(config.api.path, api);

server.listen(config.port, config.host, config.backlog, () => {
    logger.warn(`Server started listening on ${config.host}:${config.port}`);
});
