import { Component, ComponentFactory, Entity } from './entity-manager';

export class ComponentMap2 {
  readonly mask = 0n;
  readonly entity: Entity;

  [key: number]: Component;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  get<T extends ComponentFactory>(factory: T) {
    return this[factory.mask.index];
  }

  set<T extends ComponentFactory>(
    factory: T,
    component: ReturnType<typeof factory>
  ) {
    this.entity[factory.name] = component;
    this[factory.mask.index] = component;
    (this.mask as bigint) |= factory.mask.value;
  }

  has<T extends ComponentFactory>(factory: T) {
    return this[factory.mask.index] != null;
  }
}
