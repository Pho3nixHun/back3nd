'use strict';

const { Router } = require('express');
const listAllEndpoints = require('express-list-endpoints');
const config = require('config').api;

const api = new Router();

api.get('/', (req, res) => {
    const endpoints = listAllEndpoints(api);
    res.json({ version: '1.0.0.0', endpoints });
});

module.exports = api;
