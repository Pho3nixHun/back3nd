'use strict';

const express = require('express');
const { lib, bin } = require('config').client;

const { Router } = express;
const client = new Router();

client.use(bin.path, express.static(bin.directory, bin.config));
client.use(lib.path, express.static(lib.directory, lib.config));

module.exports = client;
