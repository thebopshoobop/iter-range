const { derange } = require("../lib");

describe("The derange function", () => {
  let callback;
  let spy;
  beforeEach(() => {
    callback = jasmine.createSpy();
    spy = jasmine.createSpyObj({ every: true, none: false });
  });

  describe("when calculating its length,", () => {
    it("should handle a single parameter", () => {
      expect(derange(10).length).toEqual(10);
    });

    it("should handle start and end params", () => {
      expect(derange(10, 100).length).toEqual(90);
    });

    it("should handle a custom interval", () => {
      expect(derange(5, 50, 5).length).toEqual(9);
    });

    it("should handle a negative interval", () => {
      expect(derange(55, 22, -6).length).toEqual(6);
    });

    it("should handle an invalid range", () => {
      expect(derange(40, 20).length).toEqual(0);
    });
  });

  describe("when using the every method,", () => {
    it("should check every element, if necessary", () => {
      derange(5).every(spy.every);

      expect(spy.every).toHaveBeenCalledTimes(5);
    });

    it("should return true if every element does", () => {
      expect(derange(10).every(spy.every)).toEqual(true);
    });

    it("should not check every element if not necessary", () => {
      derange(5).every(spy.none);

      expect(spy.none).toHaveBeenCalledTimes(1);
    });

    it("should return false if any item does", () => {
      expect(derange(9).every(spy.none)).toEqual(false);
    });

    it("should pass the index and the range to the every callback", () => {
      const r = derange(5, 10);
      r.every(spy.every);

      expect(spy.every).toHaveBeenCalledWith(7, 2, r);
    });

    it("should default `this` to the range in the every callback", () => {
      const r = derange(22, 33, 0.25);

      r.every(function() {
        expect(this).toBe(r);
      });
    });

    it("should assign `this` in the every callback when given one", () => {
      derange(6, 10).every(function() {
        expect(this).toBe(spy.every);
      }, spy.every);
    });

    it("should check every element", () => {
      expect(derange(0, 10, 2).every(i => i % 2 === 0)).toEqual(true);
      expect(derange(0, 10).every(i => i % 2 === 0)).toEqual(false);
    });
  });

  describe("when using the some method,", () => {
    it("should call the some callback for every element if necessary", () => {
      derange(5).some(spy.none);

      expect(spy.none).toHaveBeenCalledTimes(5);
    });

    it("should return true if any element does", () => {
      expect(derange(10).some(spy.every)).toEqual(true);
    });

    it("should call the some callback as few times as possible", () => {
      derange(5).some(spy.every);

      expect(spy.every).toHaveBeenCalledTimes(1);
    });

    it("should return false if no item does", () => {
      expect(derange(9).some(spy.none)).toEqual(false);
    });

    it("should pass the index and the range to the some callback", () => {
      const r = derange(5, 10);
      r.some(spy.none);

      expect(spy.none).toHaveBeenCalledWith(9, 4, r);
    });

    it("should default `this` to the range in the some callback", () => {
      const r = derange(22, 33, 0.25);

      r.some(function() {
        expect(this).toBe(r);
      });
    });

    it("should assign `this` in the some callback when given one", () => {
      derange(6, 10).some(function() {
        expect(this).toBe(spy.every);
      }, spy.every);
    });

    it("should check some elements", () => {
      expect(derange(0, 10, 2).some(i => i % 2 === 0)).toEqual(true);
      expect(derange(1, 11, 2).some(i => i % 2 === 0)).toEqual(false);
    });
  });

  describe("when using the filter method,", () => {
    it("should call the filter callback for every element", () => {
      derange(5).filter(spy.none);

      expect(spy.none).toHaveBeenCalledTimes(5);
    });

    it("should return elements that are truthy", () => {
      expect(derange(9).filter(spy.every)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("should not return falsy elements", () => {
      expect(derange(9).filter(spy.none)).toEqual([]);
    });

    it("should pass the index and the range to the filter callback", () => {
      const r = derange(2, 12, 2);
      r.filter(spy.none);

      expect(spy.none).toHaveBeenCalledWith(8, 3, r);
    });

    it("should default `this` to the range in the filter callback", () => {
      const r = derange(12, 5 - 2);

      r.filter(function() {
        expect(this).toBe(r);
      });
    });

    it("should assign `this` in the filter callback when given one", () => {
      derange(6, 10).filter(function() {
        expect(this).toBe(spy.every);
      }, spy.every);
    });

    it("should filter elements", () => {
      expect(derange(0, 7).filter(i => i % 2 === 0)).toEqual([0, 2, 4, 6]);
      expect(derange(1, 11, 2).filter(i => i % 2 === 0)).toEqual([]);
    });
  });

  describe("when using the find method,", () => {
    it("should check every element if necessary", () => {
      derange(5).find(spy.none);

      expect(spy.none).toHaveBeenCalledTimes(5);
    });

    it("should check the minimum elements", () => {
      derange(5).find(spy.every);

      expect(spy.every).toHaveBeenCalledTimes(1);
    });

    it("should return the first truthy element", () => {
      expect(derange(9).find(spy.every)).toEqual(0);
    });

    it("should return undefined if all elements are falsy", () => {
      expect(derange(9).find(spy.none)).toEqual(undefined);
    });

    it("should pass the index and the range to the find callback", () => {
      const r = derange(2, 12, 2);
      r.find(spy.none);

      expect(spy.none).toHaveBeenCalledWith(8, 3, r);
    });

    it("should default `this` to the range in the find callback", () => {
      const r = derange(12, 5 - 2);

      r.find(function() {
        expect(this).toBe(r);
      });
    });

    it("should assign `this` in the find callback when given one", () => {
      derange(6, 10).find(function() {
        expect(this).toBe(spy.every);
      }, spy.every);
    });

    it("should find elements", () => {
      expect(derange(1, 7).find(i => i % 4 === 0)).toEqual(4);
      expect(derange(1, 11, 2).find(i => i % 2 === 0)).toEqual(undefined);
    });
  });

  describe("when using the findIndex method,", () => {
    it("should call the findIndex callback as many times as needed", () => {
      derange(5).findIndex(spy.none);

      expect(spy.none).toHaveBeenCalledTimes(5);
    });

    it("should call the findIndex callback as few times as needed", () => {
      derange(5).findIndex(spy.every);

      expect(spy.every).toHaveBeenCalledTimes(1);
    });

    it("should return the index of the first truthy element", () => {
      expect(derange(9).findIndex(spy.every)).toEqual(0);
    });

    it("should return -1 if all elements are falsy", () => {
      expect(derange(9).findIndex(spy.none)).toEqual(-1);
    });

    it("should pass the index and range to the findIndex callback", () => {
      const r = derange(2, 12, 2);
      r.findIndex(spy.none);

      expect(spy.none).toHaveBeenCalledWith(8, 3, r);
    });

    it("should default `this` to the range in the findIndex callback", () => {
      const r = derange(12, 5 - 2);

      r.findIndex(function() {
        expect(this).toBe(r);
      });
    });

    it("should assign a given `this` in the findIndex callback", () => {
      derange(6, 10).findIndex(function() {
        expect(this).toBe(spy.every);
      }, spy.every);
    });

    it("should find the index of elements", () => {
      expect(derange(1, 7).findIndex(i => i % 4 === 0)).toEqual(3);
      expect(derange(1, 11, 2).findIndex(i => i % 2 === 0)).toEqual(-1);
    });
  });

  describe("when using the indexOf method,", () => {
    it("should return the index of included numbers", () => {
      expect(derange(0, 10, 2).indexOf(6)).toEqual(3);
      expect(derange(10, 0, -2).indexOf(6)).toEqual(2);
      expect(derange(10).indexOf(0)).toEqual(0);
    });

    it("should return -1 for non-included numbers", () => {
      expect(derange(0, 10, 2).indexOf(5)).toEqual(-1);
    });

    it("should accept and start from a fromIndex parameter", () => {
      expect(derange(5).indexOf(4, 2)).toEqual(4);
      expect(derange(10).indexOf(4, 5)).toEqual(-1);
    });

    it("should treat a negative fromIndex as an offset from the end", () => {
      expect(derange(10).indexOf(8, -4)).toEqual(8);
      expect(derange(10).indexOf(3, -3)).toEqual(-1);
    });
  });

  describe("when using the includes method,", () => {
    it("should return true for included numbers", () => {
      expect(derange(0, 10, 2).includes(6)).toEqual(true);
      expect(derange(10, 0, -2).includes(6)).toEqual(true);
      expect(derange(10).includes(0)).toEqual(true);
    });

    it("should return false for non-included numbers", () => {
      expect(derange(0, 10, 2).includes(5)).toEqual(false);
    });

    it("should accept a fromIndex parameter to begin inclusion check", () => {
      expect(derange(5).includes(4, 2)).toEqual(true);
      expect(derange(10).includes(4, 5)).toEqual(false);
    });

    it("should use a negative fromIndex as an offset from the end", () => {
      expect(derange(10).includes(8, -4)).toEqual(true);
      expect(derange(10).includes(3, -3)).toEqual(false);
    });
  });

  describe("when using the reverse method,", () => {
    it("should not reverse the original range", () => {
      const r = derange(8);
      r.reverse();

      expect([...r]).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });

    it("should return a new range", () => {
      const r = derange(5);

      expect(r.reverse()).not.toBe(r);
    });

    it("should return a reversed range", () => {
      expect([...derange(6).reverse()]).toEqual([5, 4, 3, 2, 1, 0]);
      expect([...derange(10, 0, -2).reverse()]).toEqual([2, 4, 6, 8, 10]);
    });
  });

  describe("when using the lastIndexOf method,", () => {
    it("shoud return the last index of included members", () => {
      expect(derange(12, 24).lastIndexOf(18)).toEqual(6);
    });

    it("should return -1 for non-included items", () => {
      expect(derange(12, 22).lastIndexOf(4)).toEqual(-1);
    });

    it("should accpet a fromIndex parameter to reverse search from", () => {
      expect(derange(5, 10).lastIndexOf(6, 4)).toEqual(1);
      expect(derange(5, 10).lastIndexOf(9, 3)).toEqual(-1);
    });

    it("should handle too-large fromIndex params", () => {
      expect(derange(5, 10).lastIndexOf(7, 10)).toEqual(2);
    });

    it("should handle a negative fromIndex", () => {
      expect(derange(5, 10).lastIndexOf(6, -2)).toEqual(1);
      expect(derange(5, 10).lastIndexOf(9, -3)).toEqual(-1);
      expect(derange(10).lastIndexOf(4, -12)).toEqual(-1);
    });
  });

  describe("when using the reduceRight method", () => {
    it("should reduce the callback over each element in reverse", () => {
      derange(5).reduceRight(callback, 0);

      expect(callback).toHaveBeenCalledTimes(5);
    });

    it("should pass the index and range to the reduceRight callback", () => {
      const r = derange(5, 10);
      r.reduceRight(callback, 0);

      expect(callback).toHaveBeenCalledWith(undefined, 8, 3, r);
    });

    it("should reduce the range", () => {
      const r = derange(5).reduceRight(
        (n, i) => ({ ...n, [i]: i % 2 === 0 }),
        {}
      );

      expect(r).toEqual({ 0: true, 1: false, 2: true, 3: false, 4: true });
      expect(derange(5).reduceRight((sum, i) => sum + i, 0)).toEqual(10);
    });

    it("should use the last item if no accumulator is given", () => {
      const r = derange(5);
      r.reduceRight(callback);

      expect(callback).toHaveBeenCalledWith(4, 3, 3, r);
      expect(derange(5).reduceRight((sum, i) => sum + i)).toEqual(10);
    });
  });
});
