'use strict';

class Response extends Promise {

    static get STATE() {
        return {
            PENDING: 'pending',
            RESOLVED: 'resolved',
            REJECTED: 'rejected'
        }
    }

    constructor() {
        let __private = {
            state: Response.STATE.PENDING,
            storage: new Map()
        }
        super((resolve, reject) => Object.assign(properties, { resolve, reject }));
        Object.defineProperty(this, '__private', {
            get: () => __private
        });
        Object.defineProperties(this, {
            __private: { get: () => __private }, 
            end: {
                value() {
                    properties.state = Response.STATE.RESOLVED;
                    properties.resolve(details);
                }
            }
        });
    }

    values() {
        return this.__private.storage.values();
    }

    delete(key) {
        return this.__private.storage.delete(key);
    }

    set(key, value) {
        this.__private.storage.set(key, value);
        return this;
    }

    get(key) {
        return this.__private.storage.get(key);
    }

    has(key) {
        return this.__private.storage.has(key);
    }

    get state() {
        return this.__private.state;
    }

    get result() {
        return this.__private.result;
    }

    reject(reason) {
        this.__private.state = Response.STATE.REJECTED;
        this.__private.result = reason;
        this.__private.reject(reason);
    }

    resolve(result) {
        this.__private.state = Response.STATE.RESOLVED;
        this.__private.result = result;
        this.__private.resolve(result);
    }

    end(result) {
        return this.resolve(result);
    }
}

export default Response;
