// @ts-check

const { component, World } = require("@gamedev/ecs");

const position = component(function position(x = 0, y = 0) {
  return { x, y };
});

const velocity = component(function velocity(x = 0, y = 0) {
  return { x, y };
});

const animation = component(function animation(length = 1) {
  return {
    frame: 0,
    length,
  };
});

const render = component(function render(sprite = null) {
  return {
    sprite,
  };
});

console.log(position.name, position.mask);
console.log(velocity.name, velocity.mask);
console.log(animation.name, animation.mask);
console.log(render.name, render.mask);

function setup() {
  return new World();
}

/**
 * @param {World} world
 * @param {number} count
 */
function insertEntities(world, count) {
  const entities = [];

  for (let i = 0; i < count; i++) {
    const e1 = world.createEntity().with(position, position()).build();

    const e2 = world
      .createEntity()
      .with(position, position())
      .with(render, render())
      .build();

    const e3 = world
      .createEntity()
      .with(position, position())
      .with(render, render())
      .with(animation, animation())
      .build();

    const e4 = world
      .createEntity()
      .with(position, position())
      .with(render, render())
      .with(animation, animation())
      .with(velocity, velocity())
      .build();

    entities.push(e1, e2, e3, e4);
  }

  return entities;
}

exports.bench_create_delete = (count) => {
  const world = setup();

  return () => {
    for (let entity of insertEntities(world, count)) {
      world.deleteEntity(entity);
    }
  };
};

exports.bench_update = (count) => {
  const world = setup();

  // Create filters upfront, it's more efficient
  const filter1 = world.entityManager.createFilter(position, velocity);
  const filter2 = world.entityManager.createFilter(animation);
  const filter3 = world.entityManager.createFilter(position, render);

  insertEntities(world, count);

  console.log("filter1 count", filter1.entities.length);

  console.log("filter2 count", filter2.entities.length);

  console.log("filter3 count", filter3.entities.length);

  return function gamedev_ecs_bench_update() {
    for (const entity of filter1.entities) {
      const pos = entity.position;
      const vel = entity.velocity;

      pos.x += vel.x;
      pos.y += vel.y;
    }

    for (const entity of filter2.entities) {
      const anim = entity.animation;

      anim.frame = (anim.frame + 1) % anim.length;
    }

    for (const entity of filter3.entities) {
      if (!entity) throw new Error();
    }
  };
};
