var Monad = require('../../src/Monad');
var Maybe = require('../../lib/simple-monads').Maybe;
var R = require('ramda');

describe('Monad', () => {
    describe('.get()', () => {
        it('should return the wrapped value', () => {
            expect(new Monad(10).get()).toBe(10);
        });
    });

    describe('.bind()', () => {
       it('should return the result of running a function on a monad value', () => {
           expect(new Monad(10).bind(R.inc)).toBe(11);
       });
    });

    describe('.flatMap()', () => {
        it('should return the monad returned from the passed function', () => {
            const spy = jasmine.createSpy().and.returnValue(Maybe.of(20));
            expect(Maybe.of(10).flatMap(spy).join()).toBe(20);
            expect(spy).toHaveBeenCalledWith(10);
        });
    });
});