const Benchmark = require("benchmark");

const ITERATIONS = 1_000_000;

const suite = new Benchmark.Suite();

const numberKey = 12345;
const stringKey = "12345";
const symbolKey = Symbol.for("12345");
const numericObject = { [numberKey]: 0 };
const stringObject = { [stringKey]: 0 };
const symbolObject = { [symbolKey]: 0 };

suite
  .add("no-op loop baseline", () => {
    for (let i = 0; i < ITERATIONS; ++i);
  })
  .add("numeric key read", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      numericObject[numberKey];
    }
  })
  .add("numeric key write", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      numericObject[numberKey] = i;
    }
  })
  .add("string key read", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      stringObject[stringKey];
    }
  })
  .add("string key write", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      stringObject[stringKey] = i;
    }
  })
  .add("symbol key read", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      symbolObject[symbolKey];
    }
  })
  .add("symbol key write", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      symbolObject[symbolKey] = i;
    }
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
