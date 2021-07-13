const Benchmark = require("benchmark");
const { Position } = require("../shared/position.class");

const ITERATIONS = 1_000_000;

const suite = new Benchmark.Suite();

/**
 * @type {Array<{ always(): void; sometimes?(): void }>}
 */
const entities = [];

/**
 * @type {Array<{ always(): void; sometimes?(): void }>}
 */
const entitiesWithoutOptional = [];

for (let i = 0; i < ITERATIONS; ++i) {
  entitiesWithoutOptional.push({
    always() {},
  });

  if (i % 2 === 0) {
    entities.push({
      always() {},
      sometimes() {},
    });
  } else {
    entities.push({
      always() {},
    });
  }
}

suite
  .add("no-op loop baseline", () => {
    for (const entity of entities) {
    }
  })
  .add("always existing function call", () => {
    for (const entity of entities) {
      entity.always();
    }
  })
  .add("optional function call - none exist", () => {
    for (const entity of entitiesWithoutOptional) {
      entity.sometimes?.();
    }
  })
  .add("optional function call - 50% exist", () => {
    for (const entity of entities) {
      entity.sometimes?.();
    }
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
