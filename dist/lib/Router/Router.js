'use strict';

import Path2Regexp from 'path-to-regexp';
import Request from './Request';
import Response from './Response';

const normalizePath = path => path.replace(/[\/|\\]{1,}/, '/').replace(/^\/|\/$/g, '');

class Handler {
    constructor(pattern, act, priority) {
        const keys = [];
        const regexp = Path2Regexp(path, keys)
        Object.defineProperties(this, {
            act: { value: act },
            pattern: { value: pattern.replace(/[\/]{0,}?$/m, '') },
            keys: { value: keys },
            regexp: { value: regexp }
        });
        this.priority = priority;
    }

    get name() {
        return this.act.name;
    }
}

class HandlerStore extends Array {
    /**
     * Quicker if the array mostly sorted.
     */
    shellSort() {
        let i = this.length / 2, j;
        while (i > 0) {
            for (j = i; j < this.length; j++) {
                let k = j, t = this[j];
                while (k >= i && this[k - i].priority > t.priority) this[k] = this[k -= i];
                this[k] = t;
            }
            i = Number(i === 2) || ~~(i * 5 / 11);
        }
    }
    /**
     * Quiker if the array is not sorted at all.
     */
    quickSort() {
        const partition = (arr, left, right) => {
            const pivot = arr[~~((left + right) / 2)];
            while (left <= right) {
                while (arr[left].priority - pivot.priority < 0) left++;
                while (arr[right].priority - pivot.priority > 0) right--;
                left <= right &&
                    ([arr[left], arr[right]] = [arr[right], arr[left]]) &&
                    left++ && right--;
            }
            return left;
        }
        const quicksort = (arr, left, right) => {
            const mid = partition(arr, left, right);
            (left < mid - 1) && quicksort(arr, left, mid - 1);
            (right > mid) && quicksort(arr, mid, right);
        }
        quicksort(this, 0, this.length - 1);
    }

    get lowestPriority() {
        return this.length > 1 ? this[0].priority : 0;
    }

    get highestPriority() {
        return this.length > 1 ? this[this.length - 1].priority : 0;
    }
    
    /**
     * 
     * @param {Handler} handler 
     */
    add(handler) {
        const index = isNaN(handler.priority) ? -1 : this.findIndex(h => handler.priority < h.priority);
        if (index === -1) {
            handler.priority = handler.priority || this.highestPriority;
            return this.push(handler) - 1;
        }
        this.splice(index, 0, handler);
        return index;
    }

    has() {
        return this.indexOf(handler) > -1;
    }

    delete(handler) {
        return this.deleteByIndex(this.indexOf(handler));
    }

    deleteByIndex(index) {
        return index >= 0 && index < this.length && this.splice(index, 1);
    }

    raisePriority(handler, step = 1) {
        if(this.has(handler)) {
            this.delete(handler);
            const newPriority = step === Infinity ? this.highestPriority : handler.priority + step;
            handler.priority = newPriority;
            this.add(handler);
        }
    }

    lowerPriority(handler, step = 1) {
        if(this.has(handler)) {
            this.delete(handler);
            const newPriority = step === Infinity ? this.lowestPriority - 1 : handler.priority - step;
            handler.priority = newPriority;
            this.add(handler);
        }
    }
}

class Router {
    static get Handler() { return Handler }
    static get HandlerStore() { return Handler }
    static get Methods() {
        return {
            CREATE: 'c',
            READ: 'r',
            UPDATE: 'u',
            DELETE: 'd'
        };
    }
    /**
     * @param {Function|Handler|Router} something 
     */
    static handlersOf(something) {
        switch (something.constructor) {
            case Function:
                break;
            case Handler:
                return something;
                break;
            case Router:
                return new Handler()
                break;
            case HandlerStore:
            case Array:
                return something.map(Router.handlersOf);
                break;
            default:
                throw new Error(`Cannot turn ${something.constructor} to handler`);
        }
    }

    constructor(pattern) {
        const keys = [];
        const regexp = Path2Regexp(path, keys)
        Object.defineProperties(this, {
            createHandlers: { value: new HandlerStore() },
            readHandlers: { value: new HandlerStore() },
            updateHandlers: { value: new HandlerStore() },
            deleteHandlers: { value: new HandlerStore() },
            regexp: { value: regexp },
            keys: { value: keys },
            pattern: { value: pattern.replace(/[\/]{0,}?$/m, '') }
        })
    }

    findStoreByMethod(method) {
        switch (method) {
            case Router.Methods.CREATE:
                return this.createHandlers;
            case Router.Methods.UPDATE:
                return this.updateHandlers;
            case Router.Methods.DELETE:
                return this.deleteHandlers;
            case Router.Methods.READ:
            default:
                return this.readHandlers;
        }
    }

    use(router) {
        
    }

    create(pattern, ...handlers) {

    }

    read(pattern, ...handlers) {

    }

    update(pattern, ...handlers) {

    }

    delete(pattern, ...handlers) {

    }
/**
 * 
 * @param {String} path 
 * @param {{[query: Object], [method: Router.Methods=Router.Methods.READ], [timeout]}} [options = {}] 
 */
    dispatch(path, { query, method = Router.Methods.READ, timeout } = {}) {
        const req = new Request(path, query);
        const store = this.findStoreByMethod(method);
        const normalizedPath = normalizePath(path);
        const handlers = store.filter(handler => handler.regexp.test(path));
        const res = new Response(req);
        if (handlers.length) {
            const next = () => {
                if (res.state === Response.State.PENDING) {
                    const handler = handlers.shift();
                    // TODO: req.params
                    Object.assign(req, { params: {/*TODO*/}})
                    handler.act(req, res, next);
                }
            }
        } else {
            res.reject(new Error(`No matching routes found for '${req.toString()}'`));
        }
        return res;
    }
}
