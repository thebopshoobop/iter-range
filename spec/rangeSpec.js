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
});
