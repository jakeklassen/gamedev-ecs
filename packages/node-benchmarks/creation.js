// @ts-check

const Benchmark = require("benchmark");

const suite = new Benchmark.Suite();

suite
  .add("loop baseline", () => {
    for (let i = 0; i < 1_000_000; ++i) {}
  })
  .add("new Array()", () => {
    const arr = [];

    for (let i = 0; i < 1_000_000; ++i) {
      arr.push(new Array());
    }
  })
  .add("[]", () => {
    const arr = [];

    for (let i = 0; i < 1_000_000; ++i) {
      arr.push([]);
    }
  })
  .add("object", () => {
    const arr = [];

    for (let i = 0; i < 1_000_000; ++i) {
      arr.push({});
    }
  })
  .add("map", () => {
    const arr = [];

    for (let i = 0; i < 1_000_000; ++i) {
      arr.push(new Map());
    }
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
