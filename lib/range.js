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
}

const range = (start, stop, step) => new Range(start, stop, step);

module.exports = range;
