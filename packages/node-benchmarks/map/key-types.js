const Benchmark = require("benchmark");
const { Position } = require("../shared/position.class");

const ITERATIONS = 1_000_000;

const suite = new Benchmark.Suite();

const numberKey = 12345;
const stringKey = "12345";
const symbolKey = Symbol.for("12345");

/**
 * @type {Map<number, Position>}
 */
const numericMap = new Map();
numericMap.set(numberKey, new Position());

/**
 * @type {Map<string, Position>}
 */
const stringMap = new Map();
stringMap.set(stringKey, new Position());

/**
 * @type {Map<symbol, Position>}
 */
const symbolMap = new Map();
symbolMap.set(symbolKey, new Position());

suite
  .add("no-op loop baseline", () => {
    for (let i = 0; i < ITERATIONS; ++i);
  })
  .add("numeric key read", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      numericMap.get(numberKey).x;
    }
  })
  .add("numeric key write", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      numericMap.get(numberKey).x = i;
    }
  })
  .add("string key read", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      stringMap.get(stringKey).x;
    }
  })
  .add("string key write", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      stringMap.get(stringKey).x = i;
    }
  })
  .add("symbol key read", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      symbolMap.get(symbolKey);
    }
  })
  .add("symbol key write", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      symbolMap.get(symbolKey).x = i;
    }
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
