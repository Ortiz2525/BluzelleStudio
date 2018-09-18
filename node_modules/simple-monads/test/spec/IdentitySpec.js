var Identity = require('../../lib/simple-monads').Identity;

describe('Identity modal', () => {
    describe('of()', () => {
        it('should wrap the value', () => {
            expect(Identity.of(10).toString()).toBe('Identity (10)')
        });
    });

    describe('map()', () => {
        it('should run the passed function with the value', () => {
            var spy = jasmine.createSpy().and.callFake(() => 20);
            expect(Identity.of(10).map(spy).toString()).toBe('Identity (20)');
            expect(spy).toHaveBeenCalledWith(10);
        });
    });

    describe('join', () => {
        it("should unwrap a wrapped modal", () => {
            var deep = Identity.of(Identity.of(10));
            expect(deep.join().toString()).toBe('Identity (10)');
        });
    });
});