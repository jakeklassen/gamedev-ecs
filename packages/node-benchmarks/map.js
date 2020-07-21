const Benchmark = require("benchmark");

const ITERATIONS = 1_000_000;

const suite = new Benchmark.Suite();

class Position {
  static index = 0;

  /** @type {number} */
  x;
  /** @type {number} */
  y;

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

/**
 *
 * @param {number} x
 * @param {number} y
 */
const positionFactory = (x = 0, y = 0) => ({ x, y });

const componentMapObject = {
  get(component) {
    return this[component.index];
  },

  set(ctor, component) {
    this[ctor.index] = component;
  },

  [Position.index]: new Position(13, 33),
};

const componentMap = new Map();
componentMap.set(Position, new Position());

const filterMap = new Map();
const filter = 1n << 32n;
filterMap.set(filter, componentMapObject);

const filterSym = Symbol.for(filter.toString());
const filterMapObject = {
  [filterSym]: [],
};

suite
  .add("No-op loop baseline", () => {
    for (let i = 0; i < ITERATIONS; ++i);
  })
  .add("Map component access", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMap.get(Position);

      position.x;
      position.y;
    }
  })
  .add("Map property assignment", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMap.get(Position);

      position.x = i;
      position.y = i;
    }
  })
  .add("Map bigint key access", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const components = filterMap.get(filter);
      const position = components.get(Position);
    }
  })
  .add("Map bigint key assignment", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const components = filterMap.get(filter);
      const position = components.get(Position);

      position.x = i;
      position.y = i;
    }
  })
  .add("Object access by Number index", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMapObject.get(Position);

      position.x;
      position.y;
    }
  })
  .add("Object property assignment", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMapObject.get(Position);

      position.x = i;
      position.y = i;
    }
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
