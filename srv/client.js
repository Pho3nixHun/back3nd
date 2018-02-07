'use strict';

const express = require('express');
const config = require('config').client;

const { Router } = express;
const client = new Router();

client.use(express.static(config.directory, config.options));
client.use(config.libraries, express.static('node_modules'));

module.exports = client;
