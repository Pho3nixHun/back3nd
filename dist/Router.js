'use strict';

import Path2Regexp from 'path-to-regexp';

const instances = [];

class Route {
    static get instances() {
        return instances;
    }
    static getHandlersByPath(path) {
        return Route.instances.filter(route => route.regexp.test(path));
    }
    parseParams(matches) {
        // Need to check against null not undefined.
        matches = matches || []; // eslint-disable-line no-param-reassign
        matches.shift(); // Remove first match which is the full string.
        return matches.reduce((acc, match, i) => (acc[(this.keys[i] && this.keys[i].name) || i] = match) && acc, {});
    }
    /**
     * Starts to handle the request for the given url.
     * @param {string} url Url to handle.
     * @param {object} args Argumets which will extend the query parameter in the request. Complex values can be supplied. (Func, Object, Array...)
     * @returns {Promise} Promise<Result>
     */
    static dispatch(url, args) {
        const req = new Request(url);
        Object.assign(req.query, args); // To be able to define query params without having ?param1=value1&... in the url.

        const matchingRoutes = Route.getHandlersByPath(req.path);
        if (matchingRoutes.length === 0) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            let n = 0;
            const res = new Response(resolve);

            function next() {
                const route = matchingRoutes[n++];
                if (res.ended) {
                    resolve(res); // Request handled.
                } else if (!route) {
                    reject(res); // No route to handle the request. (kinda 404)
                } else {
                    // Proceed with the next route.
                    req.params = route.parseParams(route.regexp.exec(req.path));
                    route.handler(req, res, next);
                }
            }
            next();
        });
    }
    /**
     * Register a route.
     * @param {string|RegExp} path Url's will be matched against this. Can be string, path pattern (as with expressjs) or RegExp.
     * @param {Function} handler Function which will receive 3 args. (req, res, next) => {  }
     * @returns {Route} Route instance.
     */
    static use(path, handler) {
        return new Route(path, handler);
    }
    /**
     * Removes the given route.
     * @param {Route} route
     * @returns {Route|boolean} Returns the route if found or false if not.
     */
    static remove(route) {
        const start = Route.instances.findIndex(r => r === route);
        if (start === -1) {
            return false;
        }
        return Route.instances.splice(start, 1)[0];
    }
    constructor(path, handler) {
        this.path = path;
        this.keys = [];
        this.regexp = Path2Regexp(path, this.keys);
        this.handler = handler;
        Route.instances.push(this);
    }
}
module.exports = Route;