const Benchmark = require("benchmark");
const positionLiteralFactory = require("./shared/position.factory");
const Position = require("./shared/position.class");

const ITERATIONS = 1_000_000;

const suite = new Benchmark.Suite();

/**
 *
 * @param {number} x
 * @param {number} y
 */
const positionViewFactory = (x = 0, y = 0) => {
  const positionView = new Int32Array(2);
  positionView[0] = x;
  positionView[1] = y;

  return {
    get x() {
      return positionView[0];
    },

    set x(x) {
      positionView[0] = x;
    },

    get y() {
      return positionView[1];
    },

    set y(y) {
      positionView[1] = y;
    },
  };
};

class PositionView {
  /** @type {Int32Array} */
  #position;

  constructor(x = 0, y = 0) {
    this.#position = new Int32Array(2);
    this.#position[0] = x;
    this.#position[1] = y;
  }

  get x() {
    return this.#position[0];
  }

  set x(x) {
    this.#position[0] = x;
  }

  get y() {
    return this.#position[1];
  }

  set y(y) {
    this.#position[1] = y;
  }
}

const positionInstance = new Position(12, 33);
const positionLiteral = positionLiteralFactory(12, 33);
const positionView = positionViewFactory(12, 33);
const positionViewInstace = new PositionView(12, 33);

const positionMap = new Map();
positionMap.set("x", 12);
positionMap.set("y", 33);

const positionArray = [12, 33];

const silly = {
  nested: {
    howfar: {
      position: {
        x: 13,
        y: 33,
      },
    },
  },
};

/**
 * @type {Map<{ new(): Position }, Position>}
 */
const componentMap = new Map();
componentMap.set(Position, new Position(12, 33));

const componentMapObject = {
  get(component) {
    return this[component.index];
  },
  [Position.index]: new Position(13, 33),
  // This is brutally slooow
  // Even just adding this will cause 50% drop in lookups, maybe the hidden class ?
  // [Position.name]: new Position(13, 33),
};

const PositionName = Position.name;

const componentMapObjectByStrings = {
  // This is brutally slooow
  // Even just adding this will cause 50% drop in lookups, maybe the hidden class ?
  [Position.name]: new Position(13, 33),
};

suite
  .add("No-op loop baseline", () => {
    for (let i = 0; i < ITERATIONS; ++i);
  })
  // .add("Position instance property access", () => {
  //   for (let i = 0; i < ITERATIONS; ++i) {
  //     positionInstance.x;
  //     positionInstance.y;
  //   }
  // })
  // .add("Position instance property assignment", () => {
  //   for (let i = 0; i < ITERATIONS; ++i) {
  //     positionInstance.x = i;
  //     positionInstance.y = i;
  //   }
  // })
  // .add("Position factory property access", () => {
  //   for (let i = 0; i < ITERATIONS; ++i) {
  //     positionLiteral.x;
  //     positionLiteral.y;
  //   }
  // })
  // .add("Position factory property assignment", () => {
  //   for (let i = 0; i < ITERATIONS; ++i) {
  //     positionLiteral.x = i;
  //     positionLiteral.y = i;
  //   }
  // })
  // .add("Position view property access", () => {
  //   for (let i = 0; i < ITERATIONS; ++i) {
  //     positionView.x;
  //     positionView.y;
  //   }
  // })
  // .add("Position view property assignment", () => {
  //   for (let i = 0; i < ITERATIONS; ++i) {
  //     positionView.x = i;
  //     positionView.y = i;
  //   }
  // })
  // .add("PositionView instance property access", () => {
  //   for (let i = 0; i < ITERATIONS; ++i) {
  //     positionViewInstace.x;
  //     positionViewInstace.y;
  //   }
  // })
  // .add("PositionView instance property assignment", () => {
  //   for (let i = 0; i < ITERATIONS; ++i) {
  //     positionViewInstace.x = i;
  //     positionViewInstace.y = i;
  //   }
  // })
  .add("position Map property access", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      positionMap.get("x");
      positionMap.get("y");
    }
  })
  .add("position Map property assignment", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      positionMap.set("x", i);
      positionMap.set("y", i);
    }
  })
  .add("component Map property access", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMap.get(Position);

      position.x;
      position.y;
    }
  })
  .add("component Map property assignment", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMap.get(Position);

      position.x = i;
      position.y = i;
    }
  })
  .add("component map Object access by Number index", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMapObject.get(Position);

      position.x;
      position.y;
    }
  })
  .add("component map Object property assignment", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMapObject.get(Position);

      position.x = i;
      position.y = i;
    }
  })
  .add("component map Object access by String index", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMapObjectByStrings[Position.name];

      position.x;
      position.y;
    }
  })
  .add("component map Object property assignment", () => {
    for (let i = 0; i < ITERATIONS; ++i) {
      const position = componentMapObjectByStrings[Position.name];

      position.x = i;
      position.y = i;
    }
  })
  // .add("silly object position property access", () => {
  //   for (let i = 0; i < ITERATIONS; ++i) {
  //     silly.nested.howfar.position.x;
  //     silly.nested.howfar.position.y;
  //   }
  // })
  // .add("silly object position property assignment", () => {
  //   for (let i = 0; i < ITERATIONS; ++i) {
  //     silly.nested.howfar.position.x = i;
  //     silly.nested.howfar.position.y = i;
  //   }
  // })
  // .add("position Array property access", () => {
  //   for (let i = 0; i < ITERATIONS; ++i) {
  //     positionArray[0];
  //     positionArray[1];
  //   }
  // })
  // .add("position Array property assignment", () => {
  //   for (let i = 0; i < ITERATIONS; ++i) {
  //     positionArray[0] = i;
  //     positionArray[1] = i;
  //   }
  // })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
