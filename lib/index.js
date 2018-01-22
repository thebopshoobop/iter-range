const Range = require("./range");
const Derange = require("./derange");

const range = (start, stop, step) => new Range(start, stop, step);
const derange = (start, stop, step) => new Derange(start, stop, step);

module.exports = { range, derange };
