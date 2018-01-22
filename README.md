# Iterator-Based `range`

## Quickstart

```bash
$ npm i iter-range
```

```js
const { range } = require("iter-range");
range(4).forEach(() => console.log("#winning"));
```

## Introduction

This is just one sweet little range library. It implements the same basic API as the [python `range` function](https://docs.python.org/3/library/stdtypes.html?highlight=range#range): `range([start = 0], stop, [step = 1])`. Note that in order to include a step parameter, you must specify a start. The parameters can all be negative, and floating-point numbers work too! If you provide paramaters that describe an impossible or empty range, you will recieve an empty iterator.

In point of fact, this library actually includes _two_ range implementations. The `range` factory function produces instances of the core `Range` object. `Range` objects are iterable and have lazily evaluated versions of the `forEach`, `map`, and `reduce` methods. The `derange` function builds instances of the `Derange` object, which extend `Range` and include a (constant time) `length` property and a whole bunch more of the `Array.prototype` methods. I have divided them so as to keep the core library small. I named the extended version `Derange` to reflect my mental state for feeling the need to build those additional features.

The key differentiator between this library and the other JavaScript range libraries that I have seen is that it does not create and populate arrays (other than `map`). Instead, I provide you with factory functions that build iterator objects. These objects include implementations of several Array.prototype methods that match their Array counterparts nearly exactly. If you really want an array, you can always use `Array.from(range(2, 12))` or spread the iterator `[...range(5)]`. Note that (with the exception of `map`, `reduce`, `reduceRight`, and `filter`), these are all constant-space methods. They use the iterator backend and don't create any additional arrays or objects. Furthermore, they are written to break early if possible, so a `some` call that matches on the first item stops there and returns.

## Range

The `Range` object contains the core features of this library. You can create one by calling the `range` function. `Range` objects are iterable:

```js
const { range } = require("iter-range");

for (let i of range(5)) {
  console.log(i); // logs 0, then 1, then 2, etc.
}

// Decreasing and non-integer parameters work a treat:
console.log(...range(27, 8, -4.5)); //=> 27 22.5 18 13.5 9

// The iterator resets when consumed:
const r = range(3);
console.log(...r); //=> [0, 1, 2]
console.log(...r); //=> [0, 1, 2]
```

Additionally, `Range` objects have three of the standard Array functional iteration methods:

* `forEach(callback, [thisArg])`
* `map(callback, [thisArg])`
* `reduce(callback, [accumulator])`

```js
const { range } = require("iter-range");
console.log(range(3).map(i => i ** 3)); //=> [0, 8, 27]
console.log(range(3, 6).map((i, index) => [i, index])); //=> [[3, 0], [4, 1], [5, 2]]
```

These methods are all written to consume the iterator rather than creating an array to iterate over (`map`, of course, builds an array to return).

## Derange

So `Range`s are pretty cool... but I need moar! Fortunately, I've got you covered. The `derange` factory will happily build you instances of the feature-ful `Derange`. These puppies extend `Range` so as to include all of their goodness, but they also have a whole additional posse of fun methods (and a length):

* `length`
* `reduceRight(callback, accumulator)`
* `every(callback, [thisArg])`
* `some(callback, [thisArg])`
* `includes(callback, [thisArg])`
* `filter(callback, [thisArg])`
* `find(callback, [thisArg])`
* `findIndex(callback, [thisArg])`
* `indexOf(searchElement, [fromIndex])`
* `lastIndexOf(searchElement, [fromIndex])`
* `reverse()`

If you need a refresher, you should check the [MDN Array documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array). The important bit is that all of those callbacks (except for `reduceRight`, which getss the accumulator first) will be called with three parameters: `currentValue`, `index`, and `Derange`. The only difference is the third one. Since these methods don't construct an array to iterate over, there is no array to pass. Instead they pass the `Derange` object. I hope that's helpful. Also note that negative values _are_ supported for `fromIndex`. One other difference is that reverse does _not_ mutate the `Derange` it is called on, but instead returns a new instance.

```js
const { derange } = require("iter-range");
console.log(range(3, 13, 3).length); //=> 4
console.log(...range(5).reverse()); //=> 4 3 2 1 0
console.log(...range(8).filter(i => i % 2 === 0)); //=> 0 2 4 6
```

## Testing

The `Range` and `Derange` objects are thoroughly tested to match their Array.prototype counterparts (except as noted). Please let me know if I've missed or wrongly implemented anything. You can run the tests by cloning the repository, and running [Jasmine](https://jasmine.github.io/). If you don't have it installed globally, you can simply `npm i` and then `npm test` will run the suite.
