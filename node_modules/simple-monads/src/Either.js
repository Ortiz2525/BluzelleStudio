"use strict";
var Monad = require('./Monad');

var Either = module.exports = class Either extends Monad {
    get() {
        return this.value;
    }
    static left(v) {
        return new Left(v);
    }
    static right(v) {
        return new Right(v);
    }
    static of(v){
        return v !== null && v !== undefined ? Either.right(v): Either.left(v);
    }
    isLeft() {
        return false;
    }
    isRight() {
        return false;
    }
};

class Left extends Either {

    map() {
        return this; // noop
    }

    flatMap() {
        return this; // noop
    }

    get() {
        return this.value;
    }

    getOrElse(other) {
        return other; 
    }
    orElse(f) {
        return Either.of(f(this.value));
    }
    cata(fLeft, fRight) {
        return fLeft(this.value);
    }
    isLeft() {
        return true;
    }
    toString() {
        return `Either.Left(${this.value})`;
    }
}

class Right extends Either {
    map(f) { 
        return Either.of(f(this.value));
    }
    getOrElse(other) {
        return this.value; 
    }
    orElse() { 
        return this; //noop
    }
    cata(fLeft, fRight) {
        return fRight(this.value);
    }
    isRight() {
        return true;
    }
    toString() {
        return `Either.Right(${this.value})`;
    }
}