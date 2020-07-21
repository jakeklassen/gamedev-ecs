const Benchmark = require("benchmark");
const { Position } = require("../shared/position.class");
const { RGBA } = require("../shared/rgba.class");

const ITERATIONS = 1_000_000;

const suite = new Benchmark.Suite();

class FastPosition {
  static index = 3;
  static x = 0;
  static y = 1;

  data = [0, 0];

  constructor(x = 0, y = 0) {
    this.data[FastPosition.x] = x;
    this.data[FastPosition.y] = x;
  }
}

const componentMap = {
  get(component) {
    return this[component.index];
  },

  set(ctor, component) {
    this[ctor.index] = component;
  },
};

componentMap.set(Position, new Position());
// componentMap.set(RGBA, [1, 2, 3, 4]);

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
  // .add("Object set components", () => {
  //   for (let i = 0; i < ITERATIONS; ++i) {
  //     const Ctor = componentClasses[i];
  //     componentMap.set(Ctor, new Ctor());
  //   }
  // })
  .add("Object get component by Constructor", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMap.get(Position);
    }
  })
  .add("Object get component and read property", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMap.get(Position);

      position.x;
      position.y;
    }
  })
  .add("Object get component and set property", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMap.get(Position);

      position.x = i;
      position.y = i;
    }
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
