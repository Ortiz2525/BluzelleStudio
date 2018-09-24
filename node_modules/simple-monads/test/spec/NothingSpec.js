var Nothing = require('../../lib/simple-monads').Nothing;

describe('Nothing monad', () => {
    describe('map()', () => {
        it('should not call the passed function', () => {
            var spy = jasmine.createSpy();
            expect(Nothing.of().map(spy).isNothing()).toBe(true);
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('getOrElse', () => {
        it('should return the orElse', () => {
            expect(Nothing.of().getOrElse('xxx')).toBe('xxx');
        });
    });
});