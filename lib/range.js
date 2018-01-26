const _find = (range, callback, thisArg) => {
  let index = 0;
  for (let value of range) {
    if (callback.call(thisArg, value, index, range)) {
      return { index, value };
    }
    index++;
  }
  return { index: -1, value: undefined };
};

/**
 * @callback iterCallback
 * @param {number} currentValue - The current element of the range.
 * @param {number} index - The index of the current element.
 * @param {Range} range - The current Range object.
 */

/**
 * @callback reduceCallback
 * @param {any} accumulator - The accumulated results of the reduction.
 * @param {number} currentValue - The current element of the range.
 * @param {number} index - The index of the current element.
 * @param {Range} range - The current Range object.
 */

/** Class representing an iterable range of numbers. */
class Range {
  constructor(start, stop, step) {
    this.step = step ? step : 1;
    [this.start, this.stop] = stop === undefined ? [0, start] : [start, stop];
  }

  /**
   * Generator function which makes Range objects iterable.
   * @memberof Range
   */
  *[Symbol.iterator]() {
    let state = { value: this.start, stop: this.stop };
    const [l, r] = this.step > 0 ? ["value", "stop"] : ["stop", "value"];
    while (state[l] < state[r]) {
      yield state.value;
      state.value += this.step;
    }
    state.value = this.start;
  }

  /**
   * The calculated length of the range.
   * @type {number}
   * @readonly
   * @memberof Range
   */
  get length() {
    const [l, r] = this.step > 0 ? ["start", "stop"] : ["stop", "start"];
    const valid = this[l] < this[r];
    const diff = Math.ceil(Math.abs((this.stop - this.start) / this.step));
    return valid && diff >= 0 ? diff : 0;
  }

  /**
   * Execute a callback for each element of the range.
   * @param {iterCallback} callback - The function to call for each element.
   * @param {any} [thisArg=this] - The object that `this` will refer to inside the callback.
   * @memberof Range
   */
  forEach(callback, thisArg = this) {
    let index = 0;
    for (let i of this) {
      callback.call(thisArg, i, index++, this);
    }
  }

  /**
   * Build an array with the return values of a function called for each element of the range.
   * @param {iterCallback} callback - The function to call for each element.
   * @param {any} [thisArg=this] - The object that `this` will refer to inside the callback.
   * @returns {array}
   * @memberof Range
   */
  map(callback, thisArg = this) {
    let index = 0;
    let result = [];
    for (let i of this) {
      result.push(callback.call(thisArg, i, index++, this));
    }
    return result;
  }

  /**
   * Apply a function to an accumulator and each element in the range to reduce it to a single value.
   * @param {reduceCallback} callback - The function to call for each element.
   * @param {any} [accumulator] - The initial value for the accumulator. If no accumulator is given, the first element in the array will be used.
   * @returns {any}
   * @throws {TypeError} - If given an empty range and accumulator.
   * @memberof Range
   */
  reduce(callback, accumulator) {
    let start = 0;
    let index = 0;

    if (accumulator === undefined) {
      if (this.length === 0) {
        throw TypeError("Reduce of empty range with no initial value");
      }
      start = 1;
      accumulator = this.start;
    }

    for (let i of this) {
      if (index >= start) {
        accumulator = callback(accumulator, i, index, this);
      }
      index++;
    }
    return accumulator;
  }

  /**
   * Apply a function to an accumulator and each element in the range in reverse order to reduce it to a single value.
   * @param {reduceCallback} callback - The function to call for each element.
   * @param {any} [accumulator] - The initial value for the accumulator. If no accumulator is given, the last element in the array will be used.
   * @throws {TypeError} - If given an empty range and accumulator.
   * @returns {any}
   * @memberof Range
   */
  reduceRight(callback, accumulator) {
    let start = this.length - 1;
    let index = start;
    const right = this.reverse();
    if (accumulator === undefined) {
      if (this.length === 0) {
        throw TypeError("Reduce of empty range with no initial value");
      }
      start--;
      accumulator = right.start;
    }

    for (let i of right) {
      if (index <= start) {
        accumulator = callback(accumulator, i, index, this);
      }
      index--;
    }
    return accumulator;
  }

  /**
   * Apply a function to an each element in the range, returning true if every function call does.
   * @param {iterCallback} callback - The function to call for each element.
   * @param {any} [thisArg=this] - The object that `this` will refer to inside the callback.
   * @returns {boolean}
   * @memberof Range
   */
  every(callback, thisArg = this) {
    let index = 0;
    for (let i of this) {
      if (!callback.call(thisArg, i, index++, this)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Apply a function to an each element in the range, returning true if at least one function call does.
   * @param {iterCallback} callback - The function to call for each element.
   * @param {any} [thisArg=this] - The object that `this` will refer to inside the callback.
   * @returns {boolean}
   * @memberof Range
   */
  some(callback, thisArg = this) {
    let index = 0;
    for (let i of this) {
      if (callback.call(thisArg, i, index++, this)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Apply a function to an each element in the range, returning an array populated with the elements for which the function call returns true.
   * @param {iterCallback} callback - The function to call for each element.
   * @param {any} [thisArg=this] - The object that `this` will refer to inside the callback.
   * @returns {array}
   * @memberof Range
   */
  filter(callback, thisArg = this) {
    let index = 0;
    let result = [];
    for (let i of this) {
      if (callback.call(thisArg, i, index++, this)) {
        result.push(i);
      }
    }
    return result;
  }

  /**
   * Apply a function to an each element in the range, returning the first element for which the function call returns true.
   * @param {iterCallback} callback - The function to call for each element.
   * @param {any} [thisArg=this] - The object that `this` will refer to inside the callback.
   * @returns {any}
   * @memberof Range
   */
  find(callback, thisArg = this) {
    return _find(this, callback, thisArg).value;
  }

  /**
   * Apply a function to an each element in the range, returning the index of first element for which the function call returns true.
   * @param {iterCallback} callback - The function to call for each element.
   * @param {any} [thisArg=this] - The object that `this` will refer to inside the callback.
   * @returns {number}
   * @memberof Range
   */
  findIndex(callback, thisArg = this) {
    return _find(this, callback, thisArg).index;
  }

  /**
   * Return the index of the first instance of the given element or -1.
   * @param {number} searchElement - The number to search for.
   * @param {number} [fromIndex=0] - The smallest acceptable index. If the value is greater than the length of the range, -1 will be returned. Negative indexes are treated as indexes from the right side of the range. If the calculated index is less than 0, the whole range will be considered.
   * @returns {number}
   * @memberof Range
   */
  indexOf(searchElement, fromIndex = 0) {
    const increasing = this.step > 0;
    const element = searchElement - this.start;
    const index = element / this.step;

    // Exclude searchElements that are outside the range
    const startError = increasing
      ? searchElement < this.start
      : searchElement > this.start;
    const endError = increasing
      ? searchElement >= this.stop
      : searchElement <= this.stop;
    if (startError || endError) {
      return -1;
    }

    // Exclude searchElements that aren't inside the range
    if (element % this.step !== 0) {
      return -1;
    }

    // Exclude too-large fromIndex values
    if (fromIndex >= this.length) {
      return -1;
    }

    // Normalize negative fromIndex
    fromIndex = fromIndex < 0 ? this.length + fromIndex : fromIndex;

    return index >= fromIndex ? index : -1;
  }

  /**
   * Return the index of the last instance of the given element or -1.
   * @param {number} searchElement - The number to search for.
   * @param {number} [fromIndex=0] - The largest acceptable index. If the value is greater than the length of the range, the whole range will be considered. Negative indexes are treated as indexes from the right side of the range. If the calculated index is less than 0, -1 will be returned.
   * @returns {number}
   * @memberof Range
   */
  lastIndexOf(searchElement, fromIndex = 0) {
    if (this.length + fromIndex < 0) {
      return -1;
    }

    // Normalize too-large fromIndex
    fromIndex = fromIndex > this.length ? 0 : fromIndex;

    const inverse = this.reverse().indexOf(searchElement, fromIndex);
    return inverse === -1 ? inverse : this.length - inverse - 1;
  }

  /**
   * Return true if the Range contains the given element or -1.
   * @param {number} searchElement - The number to search for.
   * @param {number} [fromIndex=0] - The smallest acceptable index. If the value is greater than the length of the range, false will be returned. Negative indexes are treated as indexes from the right side of the range. If the calculated index is less than 0, the entire range will be considered.
   * @returns {boolean}
   * @memberof Range
   */
  includes(searchElement, fromIndex = 0) {
    return this.indexOf(searchElement, fromIndex) !== -1;
  }

  /**
   * Returns a new instance of Range that will produce the range in reversed order.
   * @returns {Range}
   * @memberof Range
   */
  reverse() {
    const last = this.start + (this.length - 1) * this.step;
    return new Range(last, this.start - this.step, -this.step);
  }

  /**
   * Return the value at a given index or undefined.
   * @param {number} index - The index to query.
   * @returns {number}
   * @throws {TypeError} - If the index is out of bounds.
   * @memberof Range
   */
  get(index) {
    index = index < 0 ? index + this.length : index;
    if (index < 0 || index >= this.length) {
      throw RangeError("Range index out of bounds.");
    }

    return this.start + index * this.step;
  }
}

/**
 * Creates a Range instance.
 *
 * All of the parameters may be negative or floating point. `stop` may be included singly.
 * @param {number} [start=0] - The start of the range. Included.
 * @param {number} stop - The end of the range. Excluded.
 * @param {number} [step=1] - The interval to increment by.
 * @returns {Range}
 */
const range = (start, stop, step) => new Range(start, stop, step);

module.exports = range;
