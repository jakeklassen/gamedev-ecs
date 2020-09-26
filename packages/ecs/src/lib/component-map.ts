import { ComponentFactory, Entity } from './entity-manager';

export class ComponentMap {
  readonly mask = 0n;
  readonly entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  set<T extends ComponentFactory>(
    factory: T,
    component: ReturnType<typeof factory>
  ) {
    // @ts-ignore
    this.entity[factory.componentName] = component;
    (this.mask as bigint) |= factory.mask.value;
  }

  has<T extends ComponentFactory>(factory: T) {
    return (this.mask & factory.mask.value) === factory.mask.value;
  }
}
