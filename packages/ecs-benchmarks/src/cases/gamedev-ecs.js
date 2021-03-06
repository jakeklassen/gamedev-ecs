// @ts-check

import { component, World } from "@gamedev/ecs";

const position = component("position", (x = 0, y = 0) => ({
  x,
  y,
}));

const velocity = component("velocity", (x = 0, y = 0) => ({ x, y }));

const animation = component("animation", (length = 1) => ({
  frame: 0,
  length,
}));

const render = component("render", (sprite = null) => ({
  sprite,
}));

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

/**
 *
 * @param {number} count
 * @returns
 */
export const bench_create_delete = (count) => {
  const world = setup();

  return () => {
    for (let entity of insertEntities(world, count)) {
      world.deleteEntity(entity);
    }
  };
};

export const bench_update = (count) => {
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
      const pos = entity.components.position;
      const vel = entity.components.velocity;

      pos.x += vel.x;
      pos.y += vel.y;
    }

    for (const entity of filter2.entities) {
      const anim = entity.components.animation;

      anim.frame = (anim.frame + 1) % anim.length;
    }

    for (const entity of filter3.entities) {
      if (!entity) throw new Error();
    }
  };
};
