import { component, World } from './world';

const position = component('position', (x = 0, y = 0) => ({
  x,
  y,
}));

const velocity = component('velocity', (x = 0, y = 0) => ({
  x,
  y,
}));

const animation = component('animation', (length = 1) => ({
  frame: 0,
  length,
}));

const render = component('render', (sprite = null) => ({
  sprite,
}));

describe('world', () => {
  it('should set component factory function `name` property', () => {
    expect(position.name).toEqual('position');
    expect(velocity.name).toEqual('velocity');
    expect(animation.name).toEqual('animation');
    expect(render.name).toEqual('render');
  });

  it('should work!', () => {
    const world = new World();

    const filter1 = world.entityManager.createFilter(position, velocity);
    const filter2 = world.entityManager.createFilter(animation);

    const e1 = world.createEntity().with(position, position()).build();

    expect(
      world.entityManager.getEntityComponents(e1)?.mask === position.mask.value
    );

    const e2 = world
      .createEntity()
      .with(position, position())
      .with(render, render())
      .build();

    expect(
      world.entityManager.getEntityComponents(e2)?.mask ===
        (position.mask.value | render.mask.value)
    );

    const e3 = world
      .createEntity()
      .with(position, position())
      .with(render, render())
      .with(animation, animation())
      .build();

    expect(
      world.entityManager.getEntityComponents(e3)?.mask ===
        (position.mask.value | render.mask.value | animation.mask.value)
    );

    const e4 = world
      .createEntity()
      .with(position, position())
      .with(render, render())
      .with(animation, animation())
      .with(velocity, velocity())
      .build();

    expect(
      world.entityManager.getEntityComponents(e4)?.mask ===
        (position.mask.value |
          render.mask.value |
          animation.mask.value |
          velocity.mask.value)
    );

    expect(filter1.entities.length).toEqual(1);
    expect(filter2.entities.length).toEqual(2);

    world.deleteEntity(e4);
    expect(filter1.entities.length).toEqual(0);
    expect(filter2.entities.length).toEqual(1);
  });
});
