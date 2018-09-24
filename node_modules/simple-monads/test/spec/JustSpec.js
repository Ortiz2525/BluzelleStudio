var Just = require('../../lib/simple-monads').Just;


describe('Just', () => {
    describe('of()', () => {
        it('should return a wrapped value', () => {
             expect(Just.of(10).toString()).toBe('Maybe.Just(10)');
        });
    });

    describe('map()', () => {
        it('should run the passed function with the value', () => {
            var spy = jasmine.createSpy().and.callFake(() => 20);
            expect(Just.of(10).map(spy).toString()).toBe('Maybe.Just(20)');
            expect(spy).toHaveBeenCalledWith(10);
        });
    });

    describe('isJust()', () => {
        it('should return true', () => {
            expect(Just.of(10).isJust()).toBe(true);
        })
    });

    describe('isNothing()', () => {
        it('should return false', () => {
            expect(Just.of(10).isNothing()).toBe(false);
        });
    });

    describe('getOrElse()', () => {
        it('should return the stored value', () => {
            expect(Just.of(10).getOrElse(20)).toBe(10);
        });
    })
});