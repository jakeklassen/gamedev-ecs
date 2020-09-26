const { World, System, Component, Types } = require("ecsy");

class Position extends Component {}
Position.schema = {
  x: { type: Types.Number, default: 0 },
  y: { type: Types.Number, default: 0 },
};

class Velocity extends Component {}
Velocity.schema = {
  x: { type: Types.Number, default: 0 },
  y: { type: Types.Number, default: 0 },
};

class Animation extends Component {}
Animation.schema = {
  frame: { type: Types.Number, default: 0 },
  length: { type: Types.Number, default: 1 },
};

class Render extends Component {}
Render.schema = {
  sprite: { type: Types.String, default: "" },
};

class MovableSystem extends System {
  execute(delta, time) {
    this.queries.entities.results.forEach((entity) => {
      const velocity = entity.getComponent(Velocity);
      const position = entity.getMutableComponent(Position);
      position.x += velocity.x * delta;
      position.y += velocity.y * delta;
    });
  }
}

MovableSystem.queries = {
  entities: {
    components: [Velocity, Position],
  },
};

class AnimationSystem extends System {
  execute(delta, time) {
    this.queries.animated.results.forEach((entity) => {
      const animation = entity.getMutableComponent(Animation);
      animation.frame = (animation.frame + 1) % animation.length;
    });
  }
}

AnimationSystem.queries = {
  animated: {
    components: [Animation],
  },
};

class RenderingSystem extends System {
  execute(delta, time) {
    this.queries.entities.results.forEach((entity) => {
      const sprite = entity.getComponent(Render);
      if (sprite.sprite == null) throw new Error();
    });
  }
}

RenderingSystem.queries = {
  entities: {
    components: [Render],
  },
};

function setup() {
  return new World()
    .registerComponent(Position)
    .registerComponent(Velocity)
    .registerComponent(Render)
    .registerComponent(Animation)
    .registerSystem(MovableSystem)
    .registerSystem(AnimationSystem)
    .registerSystem(RenderingSystem);
}

/**
 *
 * @param {ecsy.World} world
 * @param {number} count
 */
function insertEntities(world, count) {
  let entities = [];

  for (let i = 0; i < count; i++) {
    let e1 = world.createEntity().addComponent(Position, { x: 0, y: 0 });

    let e2 = world
      .createEntity()
      .addComponent(Position, { x: 0, y: 0 })
      .addComponent(Render, { sprite: "" });

    let e3 = world
      .createEntity()
      .addComponent(Position, { x: 0, y: 0 })
      .addComponent(Render, { sprite: "" })
      .addComponent(Animation, { frame: 0, length: 1 });

    let e4 = world
      .createEntity()
      .addComponent(Position, { x: 0, y: 0 })
      .addComponent(Render, { sprite: "" })
      .addComponent(Animation, { frame: 0, length: 1 })
      .addComponent(Velocity, { x: 0, y: 0 });

    entities.push(e1, e2, e3, e4);
  }

  return entities;
}

exports.bench_create_delete = (count) => {
  let world = setup();

  return () => {
    for (let entity of insertEntities(world, count)) {
      entity.remove();
    }
  };
};

exports.bench_update = (count) => {
  let world = setup();

  insertEntities(world, count);

  return () => {
    world.execute(1 / 60);
  };
};
