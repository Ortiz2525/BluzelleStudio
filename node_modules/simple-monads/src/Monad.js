const Future = require('./Future');

module.exports = class Monad {
    constructor(value) {
        this.value = value;
    }

    join() {
        return this.value;
    }

    flatMap(f) {
        const result = f(this.value);
        return result instanceof Promise ? new Future(result) : result;
    }

    get() {
        return this.value;
    }

    bind(fn) {
        return fn(this.value);
    }
};