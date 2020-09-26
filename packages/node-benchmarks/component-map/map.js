const Benchmark = require("benchmark");
const { Position } = require("../shared/position.class");
const { RGBA } = require("../shared/rgba.class");
const { Velocity } = require("../shared/velocity.class");

const ITERATIONS = 1_000_000;

const suite = new Benchmark.Suite();

const componentMap = new Map();
componentMap.set(Position, new Position());
componentMap.set(Velocity, new Velocity());
componentMap.set(RGBA, new RGBA());

const componentClasses = Array.from(
  { length: ITERATIONS },
  (v, k) =>
    class {
      static index = k + 10;

      constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
      }
    }
);

suite
  .add("no-op loop baseline", () => {
    for (let i = 0; i < ITERATIONS; ++i);
  })
  .add("Map write components", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const Ctor = componentClasses[i];
      componentMap.set(Ctor, new Ctor());
    }
  })
  .add("Map get component by Constructor", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMap.get(Position);
    }
  })
  .add("Movement system", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMap.get(Position);
      const velocity = componentMap.get(Velocity);

      position.x += velocity.x;
      position.y += velocity.y;
    }
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
