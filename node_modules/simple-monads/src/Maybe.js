"use strict";
const Monad = require('./Monad');
const Either = require('./Either');
const R = require('ramda');

class Maybe extends Monad {
    static of(a) {
        return a !== null && a !== undefined ? new Just(a) : new Nothing();
    }

    isNothing() {
        return false;
    }

    isJust() {
        return false;
    }

    static lift(fn) {
        return R.compose(Maybe.of, fn);
    }

    toEither() {
        return Either.of(this.value);
    }
};

class Just extends Maybe {

    map(f) {
        return Maybe.of(f(this.value));
    }

    ap(v) {
        return Maybe.of(this.value(Maybe.of(v).join()));
    }

    getOrElse() {
        return this.value;
    }

    orElse() {
        return this
    }

    isJust() {
        return true;
    }

    toString() {
        return `Maybe.Just(${this.value})`;
    }
}

class Nothing extends Maybe {
    map(f) {
        return this; // noop (mapping over nothing)
    }

    flatMap(f) {
        return this; // noop
    }

    getOrElse(other) {
        return other;
    }

    orElse(f) {
        return Maybe.of(f(this.value));
    }

    isNothing() {
        return true;
    }

    toString() {
        return 'Maybe.Nothing';
    }
}

module.exports = {
    Maybe: Maybe,
    Just: Just,
    Nothing: Nothing
};