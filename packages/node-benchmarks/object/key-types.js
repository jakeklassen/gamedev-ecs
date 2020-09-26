const Benchmark = require("benchmark");
const { Position } = require("../shared/position.class");

const ITERATIONS = 1_000_000;

const suite = new Benchmark.Suite();

const numberKey = 12345;
const stringKey = "12345";
const symbolKey = Symbol.for("12345");

/**
 * @type {Record<number, Position>}
 */
const numericObject = { [numberKey]: new Position() };

/**
 * @type {Record<string, Position>}
 */
const stringObject = { [stringKey]: new Position() };

/**
 * @type {Record<symbol, Position>}
 */
const symbolObject = { [symbolKey]: new Position() };

suite
  .add("no-op loop baseline", () => {
    for (let i = 0; i < ITERATIONS; ++i);
  })
  .add("numeric key read", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      numericObject[numberKey].x;
    }
  })
  .add("numeric key write", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      numericObject[numberKey].x = i;
    }
  })
  .add("string key read", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      stringObject[stringKey].x;
    }
  })
  .add("string key write", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      stringObject[stringKey].x = i;
    }
  })
  .add("symbol key read", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      symbolObject[symbolKey].x;
    }
  })
  .add("symbol key write", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      symbolObject[symbolKey].x = i;
    }
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
