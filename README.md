# Iterator-Based `range`

This is just one sweet little range library. It implements the same basic API as the [python `range` function](https://docs.python.org/3/library/stdtypes.html?highlight=range#range): `range([start = 0], stop, [step = 1])`. Note that in order to include a step parameter, you must specify a start. The step can be negative, if you so desire.

The key differentiator between this library and the other JavaScript range libraries that I have seen is that it does not create and populate an array by default. Instead, `iter-range` will provide you with an iterator that has implementations of several of the key array methods. I try to have these methods match the array versions exactly. If you really want an array, you can always use `Array.from(range(2, 12))` or spread the iterator `[...range(5)]`.
