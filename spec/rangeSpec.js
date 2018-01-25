const range = require("../lib/range");

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
      expect(r.map(i => i ** 2)).toEqual([0, 1, 4, 9, 16, 25, 36, 49, 64, 81]);
    });

    it("should be recursively consumable when iterating", () => {
      const r = range(4);

      for (let _ of r) {
        expect([...r]).toEqual([0, 1, 2, 3]);
      }
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

      it("should handle a decreasing step with increasing start, stop", () => {
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

  describe("when accesssing it's methods,", () => {
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

      it("should be recursively consumable", () => {
        range(4).forEach((current, index, range) => {
          expect([...range]).toEqual([0, 1, 2, 3]);
        });
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

      it("should reset the iterator if not every element matches", () => {
        const r = range(5);

        expect(r.every(i => i >= 2)).toBe(false);
        expect(r.every(i => i >= 2)).toBe(false);
        expect(r.every(i => i >= 2)).toBe(false);
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

      it("should reset the iterator if some element matches", () => {
        const r = range(1, 4);

        expect(r.some(i => i % 2 === 0)).toBe(true);
        expect(r.some(i => i % 2 === 0)).toBe(true);
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

      it("should reset the iterator if a match is found", () => {
        const r = range(5);

        expect(r.find(i => i === 3)).toBe(3);
        expect(r.find(i => i === 3)).toBe(3);
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

      it("should reset the iterator if a finIndex callback matches early", () => {
        const r = range(10, 0, -2);

        expect(r.findIndex(i => i === 6)).toEqual(2);
        expect(r.findIndex(i => i === 6)).toEqual(2);
      });
    });

    describe("when using the indexOf method,", () => {
      it("should return the index of included numbers", () => {
        expect(range(0, 10, 2).indexOf(6)).toEqual(3);
        expect(range(10, 0, -2).indexOf(6)).toEqual(2);
        expect(range(10).indexOf(0)).toEqual(0);
      });

      it("should return -1 for non-included numbers", () => {
        expect(range(0, 10, 2).indexOf(5)).toEqual(-1);
        expect(range(5).indexOf(10)).toEqual(-1);
        expect(range(5, 10).indexOf(2)).toEqual(-1);
      });

      it("should accept and start from a fromIndex parameter", () => {
        expect(range(5).indexOf(4, 2)).toEqual(4);
        expect(range(10).indexOf(4, 5)).toEqual(-1);
      });

      it("should treat a negative fromIndex as an offset from the end", () => {
        expect(range(10).indexOf(8, -4)).toEqual(8);
        expect(range(10).indexOf(3, -3)).toEqual(-1);
      });

      it("should reset the iterator if an index is found", () => {
        const r = range(6);

        expect(r.indexOf(3)).toEqual(3);
        expect(r.indexOf(3)).toEqual(3);
      });
    });

    describe("when using the includes method,", () => {
      it("should return true for included numbers", () => {
        expect(range(0, 10, 2).includes(6)).toEqual(true);
        expect(range(10, 0, -2).includes(6)).toEqual(true);
        expect(range(10).includes(0)).toEqual(true);
      });

      it("should return false for non-included numbers", () => {
        expect(range(0, 10, 2).includes(5)).toEqual(false);
      });

      it("should accept a fromIndex parameter to begin inclusion check", () => {
        expect(range(5).includes(4, 2)).toEqual(true);
        expect(range(10).includes(4, 5)).toEqual(false);
      });

      it("should use a negative fromIndex as an offset from the end", () => {
        expect(range(10).includes(8, -4)).toEqual(true);
        expect(range(10).includes(3, -3)).toEqual(false);
      });

      it("should reset the iterator if there is an includes match", () => {
        const r = range(10, 20);

        expect(r.includes(13)).toEqual(true);
        expect(r.includes(13)).toEqual(true);
      });
    });

    describe("when using the reverse method,", () => {
      it("should not reverse the original range", () => {
        const r = range(8);
        r.reverse();

        expect([...r]).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
      });

      it("should return a new range", () => {
        const r = range(5);

        expect(r.reverse()).not.toBe(r);
      });

      it("should return a reversed range", () => {
        expect([...range(6).reverse()]).toEqual([5, 4, 3, 2, 1, 0]);
        expect([...range(10, 0, -2).reverse()]).toEqual([2, 4, 6, 8, 10]);
      });
    });

    describe("when using the lastIndexOf method,", () => {
      it("shoud return the last index of included members", () => {
        expect(range(12, 24).lastIndexOf(18)).toEqual(6);
      });

      it("should return -1 for non-included items", () => {
        expect(range(12, 22).lastIndexOf(4)).toEqual(-1);
      });

      it("should accpet a fromIndex parameter to reverse search from", () => {
        expect(range(5, 10).lastIndexOf(6, 3)).toEqual(1);
        expect(range(5, 10).lastIndexOf(9, 3)).toEqual(-1);
      });

      it("should handle too-large fromIndex params", () => {
        expect(range(5, 10).lastIndexOf(7, 10)).toEqual(2);
      });

      it("should handle a negative fromIndex", () => {
        expect(range(5, 10).lastIndexOf(6, -2)).toEqual(1);
        expect(range(5, 10).lastIndexOf(9, -3)).toEqual(-1);
        expect(range(10).lastIndexOf(4, -12)).toEqual(-1);
      });

      it("should reset the iterator when finding the last index", () => {
        const r = range(10);

        expect(r.lastIndexOf(3)).toEqual(3);
        expect(r.lastIndexOf(3)).toEqual(3);
      });
    });

    describe("when using the reduceRight method", () => {
      it("should reduce the callback over each element in reverse", () => {
        range(5).reduceRight(callback, 0);

        expect(callback).toHaveBeenCalledTimes(5);
      });

      it("should pass the index and range to the reduceRight callback", () => {
        const r = range(5, 10);
        r.reduceRight(callback, 0);

        expect(callback).toHaveBeenCalledWith(undefined, 8, 3, r);
      });

      it("should reduce the range", () => {
        const r = range(5).reduceRight(
          (n, i) => ({ ...n, [i]: i % 2 === 0 }),
          {}
        );

        expect(r).toEqual({ 0: true, 1: false, 2: true, 3: false, 4: true });
        expect(range(5).reduceRight((sum, i) => sum + i, 0)).toEqual(10);
      });

      it("should use the last item if no accumulator is given", () => {
        const r = range(5);
        r.reduceRight(callback);

        expect(callback).toHaveBeenCalledWith(4, 3, 3, r);
        expect(range(5).reduceRight((sum, i) => sum + i)).toEqual(10);
      });

      describe("when given an empty range to reduce,", () => {
        it("should return the accumulator and not call the callback", () => {
          expect(range(0, 10, -2).reduceRight(callback, spy)).toBe(spy);
          expect(callback).not.toHaveBeenCalled();
        });

        it("should throw a TypeError if there is no accumulator param", () => {
          try {
            range(3, 2).reduceRight(callback);
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

    describe("when using the get method,", () => {
      it("should return the element at the given index", () => {
        expect(range(5).get(3)).toEqual(3);
        expect(range(22, 21, -0.1).get(2)).toEqual(21.8);
      });

      it("should handle negative indexes", () => {
        expect(range(10).get(-2)).toEqual(8);
        expect(range(20, 10, -1).get(9)).toEqual(11);
      });

      it("should throw a RangeError for out of range indexes", () => {
        try {
          range(12).get(22);
        } catch (error) {
          expect(error.name).toEqual("RangeError");
          callback("positive");
        } finally {
          expect(callback).toHaveBeenCalledWith("positive");
        }
        try {
          range(22, 11, -3).get(-15);
        } catch (error) {
          expect(error.name).toEqual("RangeError");
          callback("negative");
        } finally {
          expect(callback).toHaveBeenCalledWith("negative");
        }
      });
    });
  });
});
