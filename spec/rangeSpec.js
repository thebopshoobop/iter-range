const range = require("../lib/range");

describe("The range function", () => {
  describe("when considering it as an iterator,", () => {
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

  describe("when accesssing additional properties and methods,", () => {
    let callback;
    let spy;
    beforeEach(() => {
      callback = jasmine.createSpy();
      spy = jasmine.createSpyObj({ every: true, none: false });
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
        range(5).reduce(callback);

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
    });

    describe("when using the every method,", () => {
      it("should check every element, if necessary", () => {
        range(5).every(spy.every);

        expect(spy.every).toHaveBeenCalledTimes(5);
      });

      it("should return true if every element does", () => {
        expect(range(10).every(spy.every)).toEqual(true);
      });

      it("should not check every element if not necessary", () => {
        range(5).every(spy.none);

        expect(spy.none).toHaveBeenCalledTimes(1);
      });

      it("should return false if any item does", () => {
        expect(range(9).every(spy.none)).toEqual(false);
      });

      it("should pass the index and the range to the every callback", () => {
        const r = range(5, 10);
        r.every(spy.every);

        expect(spy.every).toHaveBeenCalledWith(7, 2, r);
      });

      it("should default `this` to the range in the every callback", () => {
        const r = range(22, 33, 0.25);

        r.every(function() {
          expect(this).toBe(r);
        });
      });

      it("should assign `this` in the every callback when given one", () => {
        range(6, 10).every(function() {
          expect(this).toBe(spy.every);
        }, spy.every);
      });

      it("should check every element", () => {
        expect(range(0, 10, 2).every(i => i % 2 === 0)).toEqual(true);
        expect(range(0, 10).every(i => i % 2 === 0)).toEqual(false);
      });
    });

    describe("when using the some method,", () => {
      it("should call the some callback for every element if necessary", () => {
        range(5).some(spy.none);

        expect(spy.none).toHaveBeenCalledTimes(5);
      });

      it("should return true if any element does", () => {
        expect(range(10).some(spy.every)).toEqual(true);
      });

      it("should call the some callback as few times as possible", () => {
        range(5).some(spy.every);

        expect(spy.every).toHaveBeenCalledTimes(1);
      });

      it("should return false if no item does", () => {
        expect(range(9).some(spy.none)).toEqual(false);
      });

      it("should pass the index and the range to the some callback", () => {
        const r = range(5, 10);
        r.some(spy.none);

        expect(spy.none).toHaveBeenCalledWith(9, 4, r);
      });

      it("should default `this` to the range in the some callback", () => {
        const r = range(22, 33, 0.25);

        r.some(function() {
          expect(this).toBe(r);
        });
      });

      it("should assign `this` in the some callback when given one", () => {
        range(6, 10).some(function() {
          expect(this).toBe(spy.every);
        }, spy.every);
      });

      it("should check some elements", () => {
        expect(range(0, 10, 2).some(i => i % 2 === 0)).toEqual(true);
        expect(range(1, 11, 2).some(i => i % 2 === 0)).toEqual(false);
      });
    });

    describe("when using the filter method,", () => {
      it("should call the filter callback for every element", () => {
        range(5).filter(spy.none);

        expect(spy.none).toHaveBeenCalledTimes(5);
      });

      it("should return elements that are truthy", () => {
        expect(range(9).filter(spy.every)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      });

      it("should not return falsy elements", () => {
        expect(range(9).filter(spy.none)).toEqual([]);
      });

      it("should pass the index and the range to the filter callback", () => {
        const r = range(2, 12, 2);
        r.filter(spy.none);

        expect(spy.none).toHaveBeenCalledWith(8, 3, r);
      });

      it("should default `this` to the range in the filter callback", () => {
        const r = range(12, 5 - 2);

        r.filter(function() {
          expect(this).toBe(r);
        });
      });

      it("should assign `this` in the filter callback when given one", () => {
        range(6, 10).filter(function() {
          expect(this).toBe(spy.every);
        }, spy.every);
      });

      it("should filter elements", () => {
        expect(range(0, 7).filter(i => i % 2 === 0)).toEqual([0, 2, 4, 6]);
        expect(range(1, 11, 2).filter(i => i % 2 === 0)).toEqual([]);
      });
    });

    describe("when using the find method,", () => {
      it("should check every element if necessary", () => {
        range(5).find(spy.none);

        expect(spy.none).toHaveBeenCalledTimes(5);
      });

      it("should check the minimum elements", () => {
        range(5).find(spy.every);

        expect(spy.every).toHaveBeenCalledTimes(1);
      });

      it("should return the first truthy element", () => {
        expect(range(9).find(spy.every)).toEqual(0);
      });

      it("should return undefined if all elements are falsy", () => {
        expect(range(9).find(spy.none)).toEqual(undefined);
      });

      it("should pass the index and the range to the find callback", () => {
        const r = range(2, 12, 2);
        r.find(spy.none);

        expect(spy.none).toHaveBeenCalledWith(8, 3, r);
      });

      it("should default `this` to the range in the find callback", () => {
        const r = range(12, 5 - 2);

        r.find(function() {
          expect(this).toBe(r);
        });
      });

      it("should assign `this` in the find callback when given one", () => {
        range(6, 10).find(function() {
          expect(this).toBe(spy.every);
        }, spy.every);
      });

      it("should find elements", () => {
        expect(range(1, 7).find(i => i % 4 === 0)).toEqual(4);
        expect(range(1, 11, 2).find(i => i % 2 === 0)).toEqual(undefined);
      });
    });

    describe("when using the findIndex method,", () => {
      it("should call the findIndex callback as many times as needed", () => {
        range(5).findIndex(spy.none);

        expect(spy.none).toHaveBeenCalledTimes(5);
      });

      it("should call the findIndex callback as few times as needed", () => {
        range(5).findIndex(spy.every);

        expect(spy.every).toHaveBeenCalledTimes(1);
      });

      it("should return the index of the first truthy element", () => {
        expect(range(9).findIndex(spy.every)).toEqual(0);
      });

      it("should return -1 if all elements are falsy", () => {
        expect(range(9).findIndex(spy.none)).toEqual(-1);
      });

      it("should pass the index and range to the findIndex callback", () => {
        const r = range(2, 12, 2);
        r.findIndex(spy.none);

        expect(spy.none).toHaveBeenCalledWith(8, 3, r);
      });

      it("should default `this` to the range in the findIndex callback", () => {
        const r = range(12, 5 - 2);

        r.findIndex(function() {
          expect(this).toBe(r);
        });
      });

      it("should assign a given `this` in the findIndex callback", () => {
        range(6, 10).findIndex(function() {
          expect(this).toBe(spy.every);
        }, spy.every);
      });

      it("should find the index of elements", () => {
        expect(range(1, 7).findIndex(i => i % 4 === 0)).toEqual(3);
        expect(range(1, 11, 2).findIndex(i => i % 2 === 0)).toEqual(-1);
      });
    });
  });
});
