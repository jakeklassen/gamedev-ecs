import { Component, ComponentFactory, Entity } from './entity-manager';

function arrayCreate(length: number, value: any) {
  return arrayFill(new Array(length), value);
}

function arrayFill(arr: any[], value: any) {
  for (let i = 0; i < arr.length; ++i) {
    arr[i] = value;
  }

  return arr;
}

export class ComponentMap2 {
  readonly mask = 0n;
  readonly entity: Entity;

  [key: number]: any;

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
    this[factory.mask.index] = component;
    (this.mask as bigint) |= factory.mask.value;
  }
}

export const componentMapFactory = (entity: Entity) =>
  ({
    mask: 0n,
    entity,

    get<T extends ComponentFactory>(factory: T) {
      return this[factory.mask.index];
    },

    set<T extends ComponentFactory>(
      factory: T,
      component: ReturnType<typeof factory>
    ) {
      this[factory.mask.index] = component;
      // @ts-ignore
      this.mask |= factory.mask.value;
    },
  } as {
    readonly mask: bigint;
    readonly entity: Entity;
    get<T extends ComponentFactory>(factory: T): ReturnType<typeof factory>;
    set<T extends ComponentFactory>(
      factory: T,
      component: ReturnType<typeof factory>
    ): void;
  } & { [key: string]: any });

export class ComponentMap {
  components: Array<Component | null> = arrayCreate(32, null);
  readonly entity: Entity;

  private _mask = 0n;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  get mask() {
    return this._mask;
  }

  clear() {
    this.components = arrayCreate(32, null);
    this._mask = 0n;
  }

  add<T extends ComponentFactory>(
    factory: T,
    component: ReturnType<typeof factory>
  ) {
    this.components[factory.mask.index] = component;
    this._mask |= factory.mask.value;
  }

  addMany(components: Array<[ComponentFactory, Component]>) {
    for (const [factory, component] of components) {
      this.components[factory.mask.index] = component;
      this._mask |= factory.mask.value;
    }
  }

  get<T extends ComponentFactory>(factory: T) {
    return this.components[factory.mask.index] as
      | ReturnType<typeof factory>
      | undefined;
  }

  expect<T extends ComponentFactory>(factory: T) {
    const component = this.components[factory.mask.index];

    if (component == null) {
      throw new Error(`❌ Component "${factory}" not found`);
    }

    return component as ReturnType<typeof factory>;
  }

  has(...factories: ComponentFactory[]) {
    return factories.every(
      (factory) => this.components[factory.mask.index] != null
    );
  }

  remove(...factories: ComponentFactory[]) {
    for (const factory of factories) {
      this.components[factory.mask.index] = null;
      this._mask ^= factory.mask.value;
    }
  }
}
