module.exports = class Future {
    constructor(promise) {
        this.promise = promise;
    }


    flatMap(f) {
        return new Future(this.promise.then(m => m.flatMap(f)));
    }

    cata(fnLeft, fnRight) {
        return new Future(this.promise.then(m => m.cata(fnLeft, fnRight)));
    }

    join() {
        return this.promise;
    }
};
