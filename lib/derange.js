const Range = require("./range");

const _reset = range => (range.value = range.start);

const _find = (range, callback, thisArg) => {
  let index = 0;
  for (let value of range) {
    if (callback.call(thisArg, value, index, range)) {
      _reset(range);
      return { index, value };
    }
    index++;
  }
  return { index: -1, value: undefined };
};

class Derange extends Range {
  constructor(...props) {
    super(...props);
  }

  get length() {
    const [l, r] = this.step > 0 ? ["start", "stop"] : ["stop", "start"];
    const valid = this[l] < this[r];
    const diff = Math.ceil(Math.abs((this.stop - this.start) / this.step));
    return valid && diff >= 0 ? diff : 0;
  }

  reduceRight(callback, accumulator) {
    let start = this.length - 1;
    let index = start;
    const right = this.reverse();

    if (accumulator === undefined) {
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

  every(callback, thisArg = this) {
    let index = 0;
    for (let i of this) {
      if (!callback.call(thisArg, i, index++, this)) {
        _reset(this);
        return false;
      }
    }
    return true;
  }

  some(callback, thisArg = this) {
    let index = 0;
    for (let i of this) {
      if (callback.call(thisArg, i, index++, this)) {
        _reset(this);
        return true;
      }
    }
    return false;
  }

  includes(searchElement, fromIndex = 0) {
    return this.indexOf(searchElement, fromIndex) !== -1;
  }

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

  find(callback, thisArg = this) {
    return _find(this, callback, thisArg).value;
  }

  findIndex(callback, thisArg = this) {
    return _find(this, callback, thisArg).index;
  }

  indexOf(searchElement, fromIndex = 0) {
    if (this.step > 0) {
      if (searchElement < this.start || searchElement >= this.stop) {
        return -1;
      }
    } else {
      if (searchElement > this.start || searchElement <= this.stop) {
        return -1;
      }
    }

    fromIndex = fromIndex < 0 ? this.length + fromIndex : fromIndex;
    let index = 0;
    for (let i of this) {
      if (index >= fromIndex && i === searchElement) {
        _reset(this);
        return index;
      }
      index++;
    }
    return -1;
  }

  lastIndexOf(searchElement, fromIndex = this.length) {
    if (fromIndex >= this.length) {
      fromIndex = 0;
    } else if (fromIndex < 0) {
      fromIndex = -fromIndex - 1;
    } else {
      fromIndex = this.length - fromIndex - 1;
    }

    const inverse = this.reverse().indexOf(searchElement, fromIndex);
    return inverse === -1 ? inverse : this.length - inverse - 1;
  }

  reverse() {
    const last = this.start + (this.length - 1) * this.step;
    return new Derange(last, this.start - this.step, -this.step);
  }
}

module.exports = Derange;
