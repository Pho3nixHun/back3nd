'use strict';

const Url = require('url');

class Request {
    constructor(url, params = {}) {
        const {
            pathname, query
        } = Url.parse(url, true);
        this.path = pathname;
        this.query = query;
        this.params = params;
    }
}

module.exports = Request;
