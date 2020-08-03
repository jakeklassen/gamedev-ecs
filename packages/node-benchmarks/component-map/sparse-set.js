const Benchmark = require("benchmark");
const { Position } = require("../shared/position.class");
const { RGBA } = require("../shared/rgba.class");
const { Velocity } = require("../shared/velocity.class");
const { Component } = require("../shared/component.class");
const { SparseSet } = require("../shared/sparse-set");

const ITERATIONS = 1_000_000;

const suite = new Benchmark.Suite();

const entity = 1;

/**
 * @type {SparseSet<Position>}
 */
const positionSet = new SparseSet();
positionSet.insert(entity, new Position());

/**
 * @type {SparseSet<Velocity>}
 */
const velocitySet = new SparseSet();
velocitySet.insert(entity, new Velocity());

/**
 * @type {SparseSet<RGBA>}
 */
const rgbaSet = new SparseSet();
rgbaSet.insert(entity, new RGBA());

const anySet = new SparseSet();

const componentClasses = Array.from(
  { length: ITERATIONS },
  (v, k) =>
    class extends Component {
      static index = k + 10;

      constructor(x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;
      }
    }
);

suite
  .add("no-op loop baseline", () => {
    for (let i = 0; i < ITERATIONS; ++i);
  })
  .add("SparseSet set components", () => {
    for (let i = 2; i < ITERATIONS; ++i) {
      const Ctor = componentClasses[i];
      anySet.insert(i, new Ctor());
    }
  })
  .add("SparseSet get component by Constructor", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = positionSet.get(entity);
    }
  })
  .add("Movement system", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = positionSet.get(entity);
      const velocity = velocitySet.get(entity);

      position.x += velocity.x;
      position.y += velocity.y;
    }
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
