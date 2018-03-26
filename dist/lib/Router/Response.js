'use strict';

class Response extends Promise {

    static get State() {
        return {
            PENDING: 'pending',
            RESOLVED: 'resolved',
            REJECTED: 'rejected'
        }
    }

    constructor(request) {
        let __private = {
            state: Response.State.PENDING,
            storage: new Map()
        }
        super((resolve, reject) => Object.assign(__private, { resolve, reject }));
        Object.defineProperties(this, {
            __private: { value: __private },
            req: { value: request },
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
        this.__private.state = Response.State.REJECTED;
        this.__private.result = reason;
        this.__private.reject(reason);
    }

    resolve(result) {
        this.__private.state = Response.State.RESOLVED;
        this.__private.result = result;
        this.__private.resolve(result);
    }

    finally(act) {

    }

    end(result) {
        return this.resolve(result);
    }
}

export default Response;
