// @ts-check

const { component, World } = require("@gamedev/ecs");

const position = component((x = 0, y = 0) => ({
  x,
  y,
}));

const velocity = component((x = 0, y = 0) => ({
  x,
  y,
}));

const animation = component((length = 1) => ({
  frame: 0,
  length,
}));

const render = component((sprite = null) => ({
  sprite,
}));

console.log("position", position.mask);
console.log("velocity", velocity.mask);
console.log("animation", animation.mask);
console.log("render", render.mask);

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

  console.log("filter1 count", filter1.componentMaps.length);

  console.log("filter2 count", filter2.componentMaps.length);

  console.log("filter3 count", filter3.componentMaps.length);

  return function ekr_bench_update() {
    for (const componentMap of filter1.componentMaps) {
      const pos = componentMap.get(position);
      const vel = componentMap.get(velocity);

      pos.x += vel.x;
      pos.y += vel.y;
    }

    for (const componentMap of filter2.componentMaps) {
      const anim = componentMap.get(animation);
      anim.frame = (anim.frame + 1) % anim.length;
    }

    for (const componentMap of filter3.componentMaps) {
      if (!componentMap) throw new Error();
    }
  };
};
