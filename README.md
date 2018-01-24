# Iterable `range`

[![build status](https://travis-ci.org/thebopshoobop/iter-range.svg?branch=master)](https://travis-ci.org/thebopshoobop/iter-range)
[![code coverage](https://img.shields.io/codecov/c/github/thebopshoobop/iter-range.svg?maxAge=2592000)](https://codecov.io/gh/thebopshoobop/iter-range)
[![documentation](https://inch-ci.org/github/thebopshoobop/iter-range.svg?branch=master&style=flat)](https://inch-ci.org/github/thebopshoobop/iter-range)

## Quickstart

```bash
$ npm i iter-range
```

```js
const range = require("iter-range");
range(4).forEach(() => console.log("#winning"));
```

## Introduction

This is just one sweet little range library. It implements the same basic API as the [python `range` function](https://docs.python.org/3/library/stdtypes.html?highlight=range#range): `range([start = 0], stop, [step = 1])`. Note that in order to include a step parameter, you must specify a start. The parameters can all be negative, and floating-point numbers work too! If you provide paramaters that describe an impossible or empty range, you will recieve an object that iterates 0 times.

The key differentiator between this library and the other JavaScript range libraries that I have seen is that it does not create and populate arrays (other than `map`). Instead, I provide you a factory function that builds iterable objects. These objects also include lazily-evaluated implementations of many `Array.prototype` methods that match their Array counterparts nearly exactly. If you really want an array, you can always use `Array.from(range(2, 12))` or the spread operator `[...range(5)]`. Note that (with the exception of `map`, `reduce`, `reduceRight`, and `filter`), these are all constant-space methods. They take advantage of the object's iterable nature and don't create any additional arrays or objects. Furthermore, they are written to break early if possible, so a `some` call that matches on the first item stops there and returns.

## Range

The `Range` object contains the core features of this library. You can create one by calling the `range` function. `Range` objects are iterable and have a length:

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
console.log(...r); //=> 0 1 2

// Their length is a property
console.log(range(0, 10, 3).length); //=> 4
```

Additionally, `Range` objects have a whole possee of the standard `Array.prototype` methods:

* `forEach(callback, [thisArg])`
* `map(callback, [thisArg])`
* `reduce(callback, [accumulator])`
* `reduceRight(callback, [accumulator])`
* `every(callback, [thisArg])`
* `some(callback, [thisArg])`
* `includes(callback, [thisArg])`
* `filter(callback, [thisArg])`
* `find(callback, [thisArg])`
* `findIndex(callback, [thisArg])`
* `indexOf(searchElement, [fromIndex])`
* `lastIndexOf(searchElement, [fromIndex])`
* `reverse()`

```js
const range = require("iter-range");
console.log(range(3).map(i => i ** 3)); //=> [0, 8, 27]
console.log(range(3, 6).map((i, index) => [i, index])); //=> [[3, 0], [4, 1], [5, 2]]
console.log(...range(5).reverse()); //=> 4 3 2 1 0
console.log(range(8).filter(i => i % 2 === 0)); //=> [0, 2, 4, 6]
console.log(range(2.5, -2.75, -0.25).includes(1)); //=> true
```

If you need a refresher, on the APIs you should check the [MDN Array documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array). I have strived to match it precisely. The important bit is that the callbacks (except for `reduce` and `reduceRight`, which get the accumulator first) will be called with three parameters: `currentValue`, `index`, and `Range`. The only difference is the third one. Since these methods don't construct an array to iterate over, there is no array to pass. Instead they pass the `Range` object as the third parameter. I hope that's helpful.

Also note that negative values _are_ supported for `fromIndex`; they are treated as indexes from the _right_ side of the range). One other difference is that reverse does _not_ mutate the `Range` it is called on, but instead just returns a new instance.

## Testing

The `Range` object methods are thoroughly tested to match their Array.prototype counterparts (except as noted). Please let me know if I've missed or wrongly implemented anything. You can run the tests by cloning the repository, and running [Jasmine](https://jasmine.github.io/). If you don't have it installed globally, you can simply `$ npm i` and then `$ npm test` will run the suite. [Istanbul](https://istanbul.js.org/) is used to ensure complete test coverage. You can run the tests and generate a coverage report with `$ npm run coverage`. Likewise, you can lint the code with `$ npm run lint`.

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
Iterate over the range returning the index of the first instance of the given element or -1.

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| searchElement | <code>number</code> |  | The number to search for. |
| [fromIndex] | <code>number</code> | <code>0</code> | The index to start from. Negative indexes are treated as indexes from the right side of the range. |

<a name="Range+lastIndexOf"></a>

### range.lastIndexOf(searchElement, [fromIndex]) ⇒ <code>number</code>
Iterate over the range returning the index of the last instance of the given element or -1.

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| searchElement | <code>number</code> |  | The number to search for. |
| [fromIndex] | <code>number</code> | <code>0</code> | The index to start from. Negative indexes are treated as indexes from the right side of the range. |

<a name="Range+includes"></a>

### range.includes(searchElement, [fromIndex]) ⇒ <code>boolean</code>
Iterate over the range returning true if it contains the given element or -1.

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| searchElement | <code>number</code> |  | The number to search for. |
| [fromIndex] | <code>number</code> | <code>0</code> | The index to start from. Negative indexes are treated as indexes from the right side of the range. |

<a name="Range+reverse"></a>

### range.reverse() ⇒ [<code>Range</code>](#Range)
Returns a new instance of Range that will produce the range in reversed order.

**Kind**: instance method of [<code>Range</code>](#Range)  
<a name="range"></a>

## range([start], stop, [step]) ⇒ [<code>Range</code>](#Range)
Creates an instance of Range.

All of the parameters may be negative or floating point. `stop` may be included singly.

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
| range | [<code>Range</code>](#Range) | The current Range element. |

<a name="reduceCallback"></a>

## reduceCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| accumulator | <code>any</code> | The accumulated results of the reduction. |
| currentValue | <code>number</code> | The current element of the range. |
| index | <code>number</code> | The index of the current element. |
| range | [<code>Range</code>](#Range) | The current Range element. |

