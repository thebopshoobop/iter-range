class Range {
  constructor(start, stop, step) {
    this.step = step ? step : 1;
    [this.start, this.stop] = stop === undefined ? [0, start] : [start, stop];
    this.value = this.start;
  }

  [Symbol.iterator]() {
    const [l, r] = this.step > 0 ? ["value", "stop"] : ["stop", "value"];
    return {
      next: () => {
        const status = { done: this[l] >= this[r], value: this.value };
        this.value = status.done ? this.start : this.value + this.step;
        return status;
      }
    };
  }

  get length() {
    const [l, r] = this.step > 0 ? ["start", "stop"] : ["stop", "start"];
    const valid = this[l] < this[r];
    const diff = Math.ceil(Math.abs((this.stop - this.start) / this.step));
    return valid && diff >= 0 ? diff : 0;
  }

  map(callback, thisArg = this) {
    let index = 0;
    let result = [];
    for (let i of this) {
      result.push(callback.call(thisArg, i, index++, this));
    }
    return result;
  }

  reduce(callback, accumulator) {
    let index = 0;
    for (let i of this) {
      accumulator = callback(accumulator, i, index++, this);
    }
    return accumulator;
  }

  forEach(callback, thisArg = this) {
    let index = 0;
    for (let i of this) {
      callback.call(thisArg, i, index++, this);
    }
  }
}

const range = (start, stop, step) => new Range(start, stop, step);

module.exports = range;
