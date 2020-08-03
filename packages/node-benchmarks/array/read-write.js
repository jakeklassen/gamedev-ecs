const Benchmark = require("benchmark");
const { Position } = require("../shared/position.class");
const { Velocity } = require("../shared/velocity.class");

const ITERATIONS = 1_000_000;

const suite = new Benchmark.Suite();

const components = [new Position(), new Velocity()];

suite
  .add("no-op loop baseline", () => {
    for (let i = 0; i < ITERATIONS; ++i);
  })
  .add("Component property access", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      components[0].x;
    }
  })
  .add("Movement system", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = components[0];
      const velocity = components[1];

      position.x += velocity.x;
      position.y += velocity.y;
    }
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
