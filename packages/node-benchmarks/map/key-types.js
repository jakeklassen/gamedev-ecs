const Benchmark = require("benchmark");

const ITERATIONS = 1_000_000;

const suite = new Benchmark.Suite();

const numberKey = 12345;
const stringKey = "12345";
const symbolKey = Symbol.for("12345");

const numericMap = new Map();
numericMap.set(numberKey, 0);

const stringMap = new Map();
stringMap.set(stringKey, 0);

const symbolMap = new Map();
symbolMap.set(symbolKey, 0);

suite
  .add("no-op loop baseline", () => {
    for (let i = 0; i < ITERATIONS; ++i);
  })
  .add("numeric key read", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      numericMap.get(numberKey);
    }
  })
  .add("numeric key write", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      numericMap.set(numberKey, { i });
    }
  })
  .add("string key read", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      stringMap.get(stringKey);
    }
  })
  .add("string key write", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      stringMap.set(stringKey, { i });
    }
  })
  .add("symbol key read", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      symbolMap.get(symbolKey);
    }
  })
  .add("symbol key write", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      symbolMap.set(symbolKey, { i });
    }
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
