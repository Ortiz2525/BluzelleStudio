"use strict";
var isFunction = require('lodash/isFunction');

class IO {
    constructor(effect) {
        if (!isFunction(effect)) {
            throw 'IO Usage: function required';
        }
        this.effect = effect;
    }
    static of(a) {
        return new IO( () => a );
    }
    static from(fn) {
        return new IO(fn);
    }
    map(fn) {
        var self = this;
        return new IO(function () {
            return fn(self.effect());
        });
    }
    chain(fn) {
        return fn(this.effect());
    }
    run() {
        return this.effect();
    }
}