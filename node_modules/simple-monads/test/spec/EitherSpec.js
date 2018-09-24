var Either = require('../../lib/simple-monads').Either;
describe('Either monad', () => {

    describe('left()', () => {
        it('should generate a left with a value', () => {
            expect(Either.left(10).join()).toBe(10);
        })
    });

    describe('right()', () => {
        it('should generate a right with a value', () => {
            expect(Either.right(10).join()).toBe(10);
        });
    });

    describe('of()', () => {
        it('should assign left if value is null or undefined', () => {
            expect(Either.of(null).isLeft()).toBe(true);
            expect(Either.of(undefined).isLeft()).toBe(true);
        });

        it('should assign right if value is not null or undefined', () => {
            expect(Either.of(10).isRight()).toBe(true);
        });
    });

    describe('get()', () => {
        it('should return the value of a right', () => {
            expect(Either.of(10).get()).toBe(10);
        });

        it('should throw an exception if trying to get the value of the left', () => {
            expect(Either.of(undefined).get).toThrow();
        });
    })

    describe('map()', () => {
        it('should call passed returning right if return is not null or undefined', () => {
            var spy = jasmine.createSpy().and.returnValue(20);
            expect(Either.of(10).map(spy).isRight()).toBe(true);
            expect(spy).toHaveBeenCalledWith(10);
        });

        it('should return left if result of function is undefined', () => {
            var spy = jasmine.createSpy();
            expect(Either.of(10).map(spy).isLeft()).toBe(true);
            expect(spy).toHaveBeenCalledWith(10);
        });
    });

    describe('flatMap()', () => {
        it('should run on a right', () => {
            const spy = jasmine.createSpy().and.returnValue(10);
            expect(Either.right(20).flatMap(spy)).toBe(10);
            expect(spy).toHaveBeenCalledWith(20);
        });

        it('should not run on a left', () => {
            const spy = jasmine.createSpy();
            expect(Either.left(20).flatMap(spy).cata(() => 10, () => 20)).toBe(10);
            expect(spy).not.toHaveBeenCalled();
        });

        it('should work with promises', (done) => {
            Either.of(10)
                .flatMap(v => new Promise((resolve, reject) =>
                    setTimeout(() => resolve(Either.of(v * 2)))
                ))
                .flatMap(v => {
                    expect(v).toBe(20);
                    return Either.of(v * 2);
                })
                .flatMap(v => new Promise((resolve, reject) => {
                    expect(v).toBe(40);
                    resolve(Either.of(v * 2));
                }))
                .flatMap(v => expect(v).toBe(80) || Either.of(10))
                .flatMap(done);
        });
    });

    describe('getOrElse()', () => {
        it('should return the the value of the either if right', () => {
            expect(Either.of(10).getOrElse(20)).toBe(10);
        });

        it('should return the other if the either is left', () => {
            expect(Either.of(undefined).getOrElse(20)).toBe(20);
        });
    });

    describe('orElse()', () => {
        it('should return the value if right', () => {
            var spy = jasmine.createSpy();
            expect(Either.of(10).orElse(spy).get()).toBe(10);
            expect(spy).not.toHaveBeenCalled();
        });

        it('should run the passed function if left', () => {
            var spy = jasmine.createSpy().and.returnValue(10);
            expect(Either.left(20).orElse(spy).get()).toBe(10);
            expect(spy).toHaveBeenCalledWith(20);
        })
    });

    describe('cata()', () => {
        let leftSpy, rightSpy;

        beforeEach(() => {
            leftSpy = jasmine.createSpy();
            rightSpy = jasmine.createSpy();
        });

        it('should work with promises', (done) => {
            Either.of(10)
                .flatMap(v => new Promise((resolve, reject) => setTimeout(() => resolve(Either.of(v * 2)))))
                .cata(v => {}, v =>
                    new Promise((resolve, reject) => setTimeout(() => resolve(Either.left(100))))
                )
                .cata(v => {
                    expect(v).toBe(100);
                    done();
                }, v => {})
        });

        it('should run the left function on a left', () => {
            Either.of(undefined).cata(leftSpy, rightSpy);

            expect(leftSpy).toHaveBeenCalled();
            expect(rightSpy).not.toHaveBeenCalled();
        });

        it('should run the right function passing the value on a right', () => {
            Either.of(10).cata(leftSpy, rightSpy);

            expect(leftSpy).not.toHaveBeenCalled();
            expect(rightSpy).toHaveBeenCalledWith(10);
        });
    });

});