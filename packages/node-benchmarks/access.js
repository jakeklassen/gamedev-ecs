const Benchmark = require("benchmark");

const ITERATIONS = 1_000_000;

const suite = new Benchmark.Suite();

const filter1 = parseInt("0101", 2);
const filter2 = parseInt("01010001", 2);

const samples = Array.from({ length: ITERATIONS }, () =>
  Math.floor(Math.random() * ITERATIONS)
);

const bigintSamples = Array.from({ length: ITERATIONS }, () =>
  BigInt(Math.floor(Math.random() * ITERATIONS))
);

const objectSamples = Array.from({ length: ITERATIONS }, () => ({
  id: Math.floor(Math.random() * ITERATIONS),
}));

const emptyArray = [];
const presizedArray = new Array(ITERATIONS);
const emptyObject = {};
const emptySimpleMap = new Map();
const emptyComplexMap = new Map();

suite
  .add("no-op loop baseline", () => {
    for (let i = 0; i < ITERATIONS; ++i);
  })
  .add("empty array access", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      emptyArray[samples[i]];
    }
  })
  .add("presized array access", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      presizedArray[samples[i]];
    }
  })
  .add("object access", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      emptyObject[samples[i]];
    }
  })
  .add("Map number key access", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      emptySimpleMap.get(samples[i]);
    }
  })
  .add("Map bigint key access", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      emptyComplexMap.get(bigintSamples[i]);
    }
  })
  .add("Map object key access", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      emptyComplexMap.get(objectSamples[i]);
    }
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
