'use strict';

import Path2Regexp from 'path-to-regexp';
import URL from 'url-parse';

class Request {
    constructor(href, ...args) {
        const { hostname, pathname, query, href, origin } = URL(href);
        Object.defineProperties(this, {
            hostname: { value: hostname },
            pathname: { value: pathname },
            query: { value: Object.assign({}, query, ...args) },
            href: { value: href },
            origin: { value: origin }
        });
    }
}

export default Request;
