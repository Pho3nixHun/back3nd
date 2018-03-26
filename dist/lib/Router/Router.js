'use strict';

const Path2Regexp = function(){'use strict';function a(s,t){for(var B,u=[],v=0,w=0,x='',y=t&&t.delimiter||p,z=t&&t.delimiters||q,A=!1;null!==(B=r.exec(s));){var C=B[0],D=B[1],E=B.index;if(x+=s.slice(w,E),w=E+C.length,D){x+=D[1],A=!0;continue}var F='',G=s[w],H=B[2],I=B[3],J=B[4],K=B[5];if(!A&&x.length){var L=x.length-1;-1<z.indexOf(x[L])&&(F=x[L],x=x.slice(0,L))}x&&(u.push(x),x='',A=!1);var M=''!==F&&void 0!==G&&G!==F,P=F||y,Q=I||J;u.push({name:H||v++,prefix:F,delimiter:P,optional:'?'===K||'*'===K,repeat:'+'===K||'*'===K,partial:M,pattern:Q?e(Q):'[^'+d(P)+']+?'})}return(x||w<s.length)&&u.push(x+s.substr(w)),u}function c(s){for(var t=Array(s.length),u=0;u<s.length;u++)'object'==typeof s[u]&&(t[u]=new RegExp('^(?:'+s[u].pattern+')$'));return function(v,w){for(var A,x='',y=w&&w.encode||encodeURIComponent,z=0;z<s.length;z++){if(A=s[z],'string'==typeof A){x+=A;continue}var C,B=v?v[A.name]:void 0;if(Array.isArray(B)){if(!A.repeat)throw new TypeError('Expected "'+A.name+'" to not repeat, but got array');if(0===B.length){if(A.optional)continue;throw new TypeError('Expected "'+A.name+'" to not be empty')}for(var D=0;D<B.length;D++){if(C=y(B[D]),!t[z].test(C))throw new TypeError('Expected all "'+A.name+'" to match "'+A.pattern+'"');x+=(0===D?A.prefix:A.delimiter)+C}continue}if('string'==typeof B||'number'==typeof B||'boolean'==typeof B){if(C=y(B+''),!t[z].test(C))throw new TypeError('Expected "'+A.name+'" to match "'+A.pattern+'", but got "'+C+'"');x+=A.prefix+C;continue}if(A.optional){A.partial&&(x+=A.prefix);continue}throw new TypeError('Expected "'+A.name+'" to be '+(A.repeat?'an array':'a string'))}return x}}function d(s){return s.replace(/([.+*?=^!:${}()[\]|/\\])/g,'\\$1')}function e(s){return s.replace(/([=!:$/()])/g,'\\$1')}function f(s){return s&&s.sensitive?'':'i'}function g(s,t){if(!t)return s;var u=s.source.match(/\((?!\?)/g);if(u)for(var v=0;v<u.length;v++)t.push({name:v,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,pattern:null});return s}function h(s,t,u){for(var v=[],w=0;w<s.length;w++)v.push(o(s[w],t,u).source);return new RegExp('(?:'+v.join('|')+')',f(u))}function l(s,t,u){return n(a(s,u),t,u)}function n(s,t,u){u=u||{};for(var D,v=u.strict,w=!1!==u.end,x=d(u.delimiter||p),y=u.delimiters||q,z=[].concat(u.endsWith||[]).map(d).concat('$').join('|'),A='',B=!1,C=0;C<s.length;C++)if(D=s[C],'string'==typeof D)A+=d(D),B=C===s.length-1&&-1<y.indexOf(D[D.length-1]);else{var E=d(D.prefix),F=D.repeat?'(?:'+D.pattern+')(?:'+E+'(?:'+D.pattern+'))*':D.pattern;t&&t.push(D),A+=D.optional?D.partial?E+'('+F+')?':'(?:'+E+'('+F+'))?':E+'('+F+')'}return w?(!v&&(A+='(?:'+x+')?'),A+='$'===z?'$':'(?='+z+')'):(!v&&(A+='(?:'+x+'(?='+z+'))?'),!B&&(A+='(?='+x+'|'+z+')')),new RegExp('^'+A,f(u))}function o(s,t,u){return s instanceof RegExp?g(s,t):Array.isArray(s)?h(s,t,u):l(s,t,u)}var p='/',q='./',r=new RegExp(['(\\\\.)','(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'].join('|'),'g');return Object.assign(o,{parse:a,compile:function(s,t){return c(a(s,t))},tokensToFunction:c,tokensToRegExp:n})}();

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

    toString() {
        return `${this.hostname}/${this.pathname}`;
    }
}

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

class Handler {
    static normalizePath(path) {
        const multipleSlashes = /[\/|\\]{1,}/g;
        const endingSlash = /[\/]{1,}?$/;
        return path.replace(multipleSlashes, '/').replace(endingSlash, '');
    }

    constructor(pattern, act, priority) {
        const keys = [];
        const normalizedPattern = Handler.normalizePath(pattern);
        const regexp = Path2Regexp(normalizedPattern, keys);
        Object.defineProperties(this, {
            act: { value: act },
            pattern: { value: normalizedPattern },
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

class Router extends Handler {
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

    constructor(pattern, priority) {
        super(pattern);
        const keys = [];
        Object.defineProperties(this, {
            act: { value: this.dispatch },
            name: { value: `Router:${normalizedPattern}`},
            createHandlers: { value: new HandlerStore() },
            readHandlers: { value: new HandlerStore() },
            updateHandlers: { value: new HandlerStore() },
            deleteHandlers: { value: new HandlerStore() }
        });
        this.priority = priority;
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
        /**
         * this.pattern /api/:version
         * router.pattern /users/:id
         */
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
