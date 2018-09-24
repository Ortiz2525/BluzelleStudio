"use strict";
var List = require('../../lib/simple-monads').List;

describe('List monad', () => {
    describe('map()', () => {
        it('should not call map if value null or undefined', () => {
            var spy = jasmine.createSpy();
            List.of(undefined).map(spy);
            List.of(null).map(spy);
            expect(spy).not.toHaveBeenCalled();
        });

        it('should call map if value is not null', () => {
            var spy = jasmine.createSpy();
            List.of([1,2,3]).map(spy);
            expect(spy).toHaveBeenCalledWith([1,2,3]);
        });

        it('should return a new List monad', () => {
            var spy = jasmine.createSpy().and.returnValue([4,5,6]);
            expect(List.of([1,2,3]).map(spy).toString()).toBe('List(4,5,6)');

        });
    });


});