const { range } = require("../lib");

describe("The range function", () => {
  describe("when considering the iterator properties,", () => {
    it("should produce an iterator", () => {
      expect(Symbol.iterator in Object(range(4))).toBeTruthy();
    });

    it("should be iterable", () => {
      let i = 0;
      for (let r of range(66)) {
        expect(r).toEqual(i++);
      }
    });

    it("should be consumable more than once", () => {
      const r = range(10);

      expect([...r]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect([...r]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("should treat a single parameter as a max and start from 0", () => {
      expect([...range(8)]).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });

    it("should treat two parameters as lower and upper bounds", () => {
      expect([...range(2, 10)]).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("should accept a third parameter to set the increment", () => {
      expect([...range(1, 12, 3)]).toEqual([1, 4, 7, 10]);
    });

    it("should handle a negative increment", () => {
      expect([...range(22, 11, -3)]).toEqual([22, 19, 16, 13]);
    });

    describe("when supplying it with impossible combinations,", () => {
      it("should default to one when given a zero increment", () => {
        expect([...range(1, 3, 0)]).toEqual([1, 2]);
      });

      it("should handle a larger start than end", () => {
        expect([...range(10, 1)]).toEqual([]);
      });

      it("should handle a smaler start than end and negative increment", () => {
        expect([...range(1, 10, -5)]).toEqual([]);
      });

      it("should handle a single negative parameter", () => {
        expect([...range(-4)]).toEqual([]);
      });
    });
  });

  describe("when calculating its length,", () => {
    it("should handle a single parameter", () => {
      expect(range(10).length).toEqual(10);
    });

    it("should handle start and end params", () => {
      expect(range(10, 100).length).toEqual(90);
    });

    it("should handle a custom interval", () => {
      expect(range(5, 50, 5).length).toEqual(9);
    });

    it("should handle a negative interval", () => {
      expect(range(55, 22, -6).length).toEqual(6);
    });

    it("should handle an invalid range", () => {
      expect(range(40, 20).length).toEqual(0);
    });
  });

  describe("when accesssing it's iteration methods,", () => {
    let callback;
    let spy;
    beforeEach(() => {
      callback = jasmine.createSpy();
      spy = jasmine.createSpyObj({ every: true, none: false });
    });

    describe("when using the map method,", () => {
      it("should map the callback over each element", () => {
        range(5).map(callback);

        expect(callback).toHaveBeenCalledTimes(5);
      });

      it("should pass the index and the range to the map callback", () => {
        const r = range(5, 10);
        r.map(callback);

        expect(callback).toHaveBeenCalledWith(8, 3, r);
      });

      it("should default `this` to the range in the map callback", () => {
        const r = range(22, 33, 0.25);

        r.map(function() {
          expect(this).toBe(r);
        });
      });

      it("should assign `this` in the map callback when given one", () => {
        range(6, 10).map(function() {
          expect(this).toBe(callback);
        }, callback);
      });

      it("should return a mapped array", () => {
        expect(range(5).map(i => i ** 2)).toEqual([0, 1, 4, 9, 16]);
      });
    });

    describe("when using the forEach method,", () => {
      it("should call the callback for each element", () => {
        range(5).forEach(callback);

        expect(callback).toHaveBeenCalledTimes(5);
      });

      it("should pass the index and the range to the forEach callback", () => {
        const r = range(5, 10);
        r.forEach(callback);

        expect(callback).toHaveBeenCalledWith(8, 3, r);
      });

      it("should default `this` to the range in the forEach callback", () => {
        const r = range(22, 33, 0.25);

        r.forEach(function() {
          expect(this).toBe(r);
        });
      });

      it("should assign `this` in the forEach callback when given one", () => {
        range(6, 10).forEach(function() {
          expect(this).toBe(callback);
        }, callback);
      });
    });

    describe("when using the reduce method,", () => {
      it("should reduce the callback over each element", () => {
        range(5).reduce(callback, 0);

        expect(callback).toHaveBeenCalledTimes(5);
      });

      it("should pass the index and the range to the reduce callback", () => {
        const r = range(5, 10);
        r.reduce(callback);

        expect(callback).toHaveBeenCalledWith(undefined, 8, 3, r);
      });

      it("should reduce the given range", () => {
        const r = range(5).reduce((n, i) => ({ ...n, [i]: i % 2 === 0 }), {});

        expect(r).toEqual({ 0: true, 1: false, 2: true, 3: false, 4: true });
        expect(range(5).reduce((sum, i) => sum + i, 0)).toEqual(10);
      });

      it("should use the first item if no accumulator is given", () => {
        const r = range(5);
        r.reduce(callback);

        expect(callback).toHaveBeenCalledWith(0, 1, 1, r);
        expect(range(5).reduce((sum, i) => sum + i)).toEqual(10);
      });

      describe("when given an empty range,", () => {
        it("should return the accumulator without calling the callback", () => {
          expect(range(0, 10, -2).reduce(callback, spy)).toBe(spy);
          expect(callback).not.toHaveBeenCalled();
        });

        it("should throw a TypeError if there is no accumulator", () => {
          try {
            range(3, 2).reduce(callback);
          } catch (error) {
            expect(error.name).toEqual("TypeError");
            expect(callback).not.toHaveBeenCalled();
            callback("caught");
          } finally {
            expect(callback).toHaveBeenCalledWith("caught");
          }
        });
      });
    });
  });
});
