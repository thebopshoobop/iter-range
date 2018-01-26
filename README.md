# Iterable `range`

[![npm version](https://badge.fury.io/js/iter-range.svg)](https://badge.fury.io/js/iter-range)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
[![ISC License](https://goo.gl/RvzTyG)](https://opensource.org/licenses/ISC)
[![build status](https://travis-ci.org/thebopshoobop/iter-range.svg?branch=master)](https://travis-ci.org/thebopshoobop/iter-range)
[![code coverage](https://img.shields.io/codecov/c/github/thebopshoobop/iter-range.svg?maxAge=2592000)](https://codecov.io/gh/thebopshoobop/iter-range)
[![documentation](https://inch-ci.org/github/thebopshoobop/iter-range.svg?branch=master&style=flat)](https://inch-ci.org/github/thebopshoobop/iter-range)
[![dependency version status](https://david-dm.org/thebopshoobop/iter-range/status.svg)](https://david-dm.org/thebopshoobop/iter-range)
[![dev dependency version status](https://david-dm.org/thebopshoobop/iter-range/dev-status.svg)](https://david-dm.org/thebopshoobop/iter-range?type=dev)
[![Code Climate](https://codeclimate.com/github/thebopshoobop/iter-range.svg)](https://codeclimate.com/github/thebopshoobop/iter-range)

## Quickstart

```bash
npm i iter-range
```

```js
const range = require("iter-range");

for (let i of range(10, 0, -1)) {
  console.log(i);
}
console.log("Midnight!");

range(4).forEach(() => console.log("#winning"));
```

## Introduction

This is just a sweet little range library. It implements the same basic API as the [python `range` function](https://docs.python.org/3/library/stdtypes.html?highlight=range#range): `range([start = 0], stop, [step = 1])`. The key differentiator between this library and the other JavaScript range libraries that I have seen is that it does not create and populate arrays with the given parameters. Instead, I provide you a factory function that builds iterable `Range` objects.

`Range` objects also include lazily-evaluated implementations of many `Array.prototype` methods that match their Array counterparts nearly exactly. If you really want an array, you can always use `Array.from(range(2, 12))` or the spread operator `[...range(5)]`. There is also a `get` method, which will return the value at a given index.

Note that (with the exception of `map`, `reduce`, `reduceRight`, and `filter`), these are all constant-space methods. They take advantage of the object's iterable nature and don't create any additional arrays or objects. Furthermore, those that accept a callback are written to break early if possible; a `some` call that matches on the first item stops there and returns. Likewise, `indexOf`, `lastIndexOf`, `includes`, and `get` are all constant-time operations.

## Range

This library exports a single function `range`, which is a factory for producing `Range` objects. `Range` objects are iterable and have a length:

```js
const range = require("iter-range");

for (let i of range(5)) {
  console.log(i); // logs 0, then 1, then 2, etc.
}

// Decreasing and non-integer parameters work a treat:
console.log(...range(27, 8, -4.5)); //=> 27 22.5 18 13.5 9

// The iterator resets when consumed:
const r = range(3);
console.log(...r); //=> 0 1 2
console.log(Array.from(r)); //=> [0, 1, 2]
console.log(...r); //=> 0 1 2

// They have a length property
console.log(range(5).length); //=> 5
console.log(range(0, 10, 3).length); //=> 4
```

Additionally, `Range` objects have a whole posse of the standard `Array.prototype` methods (and `get`):

```js
const range = require("iter-range");
console.log(range(3, 6).map((i, index) => [i, index])); //=> [[3, 0], [4, 1], [5, 2]]
console.log(...range(5).reverse()); //=> 4 3 2 1 0
console.log(range(8).filter(i => i % 2 === 0)); //=> [0, 2, 4, 6]
console.log(range(2.5, -2.75, -0.25).includes(1)); //=> true
console.log(range(10, 0, -1).indexOf(3)); //=> 7
console.log(range(2.5, 15, 1.25).get(2)); //=> 5
```

I have strived to match the [Array API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) precisely for these methods. For details, refer to the `Range` API documentation below.

### Exceptions

* Since these methods don't construct an array to iterate over, there is no array to pass to the callbacks that would normally receive them. Instead they pass the `Range` object as the third parameter. I hope that's helpful.

* Reverse does _not_ mutate the `Range` it is called on, it just returns a new instance.

## Development

The `Range` object methods are thoroughly tested to match their `Array.prototype` counterparts (except as noted). Please let me know if I've missed or wrongly implemented anything. [Jasmine](https://jasmine.github.io/) is used for tests, [Istanbul](https://istanbul.js.org/) is used to ensure complete test coverage, [ESLint](https://eslint.org/) is used for linting, and [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown) is used to generate the documentation. You can prepare the dev environment by cloning the repository and installing the dependencies (`$ npm i`).

* Tests: `npm test`
* Coverage: `npm coverage`
* Linting: `npm run lint`
* Documentation: `npm run doc`

# API

<a name="Range"></a>

## Range
Class representing an iterable range of numbers.

**Kind**: global class  

* [Range](#Range)
    * [.length](#Range+length) : <code>number</code>
    * [.forEach(callback, [thisArg])](#Range+forEach)
    * [.map(callback, [thisArg])](#Range+map) ⇒ <code>array</code>
    * [.reduce(callback, [accumulator])](#Range+reduce) ⇒ <code>any</code>
    * [.reduceRight(callback, [accumulator])](#Range+reduceRight) ⇒ <code>any</code>
    * [.every(callback, [thisArg])](#Range+every) ⇒ <code>boolean</code>
    * [.some(callback, [thisArg])](#Range+some) ⇒ <code>boolean</code>
    * [.filter(callback, [thisArg])](#Range+filter) ⇒ <code>array</code>
    * [.find(callback, [thisArg])](#Range+find) ⇒ <code>any</code>
    * [.findIndex(callback, [thisArg])](#Range+findIndex) ⇒ <code>number</code>
    * [.indexOf(searchElement, [fromIndex])](#Range+indexOf) ⇒ <code>number</code>
    * [.lastIndexOf(searchElement, [fromIndex])](#Range+lastIndexOf) ⇒ <code>number</code>
    * [.includes(searchElement, [fromIndex])](#Range+includes) ⇒ <code>boolean</code>
    * [.reverse()](#Range+reverse) ⇒ [<code>Range</code>](#Range)
    * [.get(index)](#Range+get) ⇒ <code>number</code>

<a name="Range+length"></a>

### range.length : <code>number</code>
The calculated length of the range.

**Kind**: instance property of [<code>Range</code>](#Range)  
**Read only**: true  
<a name="Range+forEach"></a>

### range.forEach(callback, [thisArg])
Execute a callback for each element of the range.

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | [<code>iterCallback</code>](#iterCallback) |  | The function to call for each element. |
| [thisArg] | <code>any</code> | <code>this</code> | The object that `this` will refer to inside the callback. |

<a name="Range+map"></a>

### range.map(callback, [thisArg]) ⇒ <code>array</code>
Build an array with the return values of a function called for each element of the range.

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | [<code>iterCallback</code>](#iterCallback) |  | The function to call for each element. |
| [thisArg] | <code>any</code> | <code>this</code> | The object that `this` will refer to inside the callback. |

<a name="Range+reduce"></a>

### range.reduce(callback, [accumulator]) ⇒ <code>any</code>
Apply a function to an accumulator and each element in the range to reduce it to a single value.

**Kind**: instance method of [<code>Range</code>](#Range)  
**Throws**:

- <code>TypeError</code> - If given an empty range and accumulator.


| Param | Type | Description |
| --- | --- | --- |
| callback | [<code>reduceCallback</code>](#reduceCallback) | The function to call for each element. |
| [accumulator] | <code>any</code> | The initial value for the accumulator. If no accumulator is given, the first element in the array will be used. |

<a name="Range+reduceRight"></a>

### range.reduceRight(callback, [accumulator]) ⇒ <code>any</code>
Apply a function to an accumulator and each element in the range in reverse order to reduce it to a single value.

**Kind**: instance method of [<code>Range</code>](#Range)  
**Throws**:

- <code>TypeError</code> - If given an empty range and accumulator.


| Param | Type | Description |
| --- | --- | --- |
| callback | [<code>reduceCallback</code>](#reduceCallback) | The function to call for each element. |
| [accumulator] | <code>any</code> | The initial value for the accumulator. If no accumulator is given, the last element in the array will be used. |

<a name="Range+every"></a>

### range.every(callback, [thisArg]) ⇒ <code>boolean</code>
Apply a function to an each element in the range, returning true if every function call does.

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | [<code>iterCallback</code>](#iterCallback) |  | The function to call for each element. |
| [thisArg] | <code>any</code> | <code>this</code> | The object that `this` will refer to inside the callback. |

<a name="Range+some"></a>

### range.some(callback, [thisArg]) ⇒ <code>boolean</code>
Apply a function to an each element in the range, returning true if at least one function call does.

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | [<code>iterCallback</code>](#iterCallback) |  | The function to call for each element. |
| [thisArg] | <code>any</code> | <code>this</code> | The object that `this` will refer to inside the callback. |

<a name="Range+filter"></a>

### range.filter(callback, [thisArg]) ⇒ <code>array</code>
Apply a function to an each element in the range, returning an array populated with the elements for which the function call returns true.

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | [<code>iterCallback</code>](#iterCallback) |  | The function to call for each element. |
| [thisArg] | <code>any</code> | <code>this</code> | The object that `this` will refer to inside the callback. |

<a name="Range+find"></a>

### range.find(callback, [thisArg]) ⇒ <code>any</code>
Apply a function to an each element in the range, returning the first element for which the function call returns true.

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | [<code>iterCallback</code>](#iterCallback) |  | The function to call for each element. |
| [thisArg] | <code>any</code> | <code>this</code> | The object that `this` will refer to inside the callback. |

<a name="Range+findIndex"></a>

### range.findIndex(callback, [thisArg]) ⇒ <code>number</code>
Apply a function to an each element in the range, returning the index of first element for which the function call returns true.

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | [<code>iterCallback</code>](#iterCallback) |  | The function to call for each element. |
| [thisArg] | <code>any</code> | <code>this</code> | The object that `this` will refer to inside the callback. |

<a name="Range+indexOf"></a>

### range.indexOf(searchElement, [fromIndex]) ⇒ <code>number</code>
Return the index of the first instance of the given element or -1.

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| searchElement | <code>number</code> |  | The number to search for. |
| [fromIndex] | <code>number</code> | <code>0</code> | The smallest acceptable index. If the value is greater than the length of the range, -1 will be returned. Negative indexes are treated as indexes from the right side of the range. If the calculated index is less than 0, the whole range will be considered. |

<a name="Range+lastIndexOf"></a>

### range.lastIndexOf(searchElement, [fromIndex]) ⇒ <code>number</code>
Return the index of the last instance of the given element or -1.

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| searchElement | <code>number</code> |  | The number to search for. |
| [fromIndex] | <code>number</code> | <code>0</code> | The largest acceptable index. If the value is greater than the length of the range, the whole range will be considered. Negative indexes are treated as indexes from the right side of the range. If the calculated index is less than 0, -1 will be returned. |

<a name="Range+includes"></a>

### range.includes(searchElement, [fromIndex]) ⇒ <code>boolean</code>
Return true if the Range contains the given element or -1.

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| searchElement | <code>number</code> |  | The number to search for. |
| [fromIndex] | <code>number</code> | <code>0</code> | The smallest acceptable index. If the value is greater than the length of the range, false will be returned. Negative indexes are treated as indexes from the right side of the range. If the calculated index is less than 0, the entire range will be considered. |

<a name="Range+reverse"></a>

### range.reverse() ⇒ [<code>Range</code>](#Range)
Returns a new instance of Range that will produce the range in reversed order.

**Kind**: instance method of [<code>Range</code>](#Range)  
<a name="Range+get"></a>

### range.get(index) ⇒ <code>number</code>
Return the value at a given index.

**Kind**: instance method of [<code>Range</code>](#Range)  
**Throws**:

- <code>TypeError</code> - If the index is out of bounds.


| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | The index to query. Negative indexes will be treated as indexes from the end of the range. |

<a name="range"></a>

## range([start], stop, [step]) ⇒ [<code>Range</code>](#Range)
Creates a Range instance.

All of the parameters may be negative or floating point. If you only pass a single parameter, it will be used as `stop`. In order to pass a `step`, you must pass all three. In order to create a decreasing `Range`, you must pass a negative `step`. If you provide parameters that describe an impossible or empty range, you will receive an object that iterates 0 times.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [start] | <code>number</code> | <code>0</code> | The start of the range. Included. |
| stop | <code>number</code> |  | The end of the range. Excluded. |
| [step] | <code>number</code> | <code>1</code> | The interval to increment by. |

<a name="iterCallback"></a>

## iterCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| currentValue | <code>number</code> | The current element of the range. |
| index | <code>number</code> | The index of the current element. |
| range | [<code>Range</code>](#Range) | The current Range object. |

<a name="reduceCallback"></a>

## reduceCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| accumulator | <code>any</code> | The accumulated results of the reduction. |
| currentValue | <code>number</code> | The current element of the range. |
| index | <code>number</code> | The index of the current element. |
| range | [<code>Range</code>](#Range) | The current Range object. |

