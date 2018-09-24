"use strict";
var Monad = require('./Monad');
var Maybe = require('./Maybe').Maybe;


module.exports = class List extends Monad {
    static of(list) {
        return new List(Maybe.of(list));
    }

    map(fn) {
        return List.of(this.value.map(list => fn(list)));
    }

    toString() {
        return `List(${this.value.get().get()})`;
    }

    get() {
        return this.value.get().get();
    }
};