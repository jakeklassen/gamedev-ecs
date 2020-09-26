import { ComponentMap } from './component-map';
import { EntityBuilder } from './entity-builder';
import { UnionToIntersection } from './types';

export type SimpleType = string | number | bigint | boolean | null;

export type Component = {
  [key: string]: SimpleType | Array<SimpleType | Component> | Component;
};

export type ComponentFactory<T = Component> = {
  readonly componentName: string;
  (): T;
  mask: {
    value: bigint;
    index: number;
  };
};

export type EntityId = number;

// @ts-ignore
type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

// export type Entity = {
//   [K in 'id']: EntityId;
// } & {
//   [K: string]: Component;
// };

// const entityFactory = (id: EntityId) =>
//   ({
//     id,
//   } as Entity);

export class Entity {
  constructor(public readonly id: EntityId = 0) {}
}

type ComponentFilter<T> = UnionToIntersection<
  T extends ComponentFactory<infer U> ? Record<T['componentName'], U> : never
>;

export type EntityOf<T extends ComponentFactory[]> = Entity &
  ComponentFilter<T[number]>;

export class Filter {
  constructor(
    public readonly mask: bigint,
    public readonly entities: Entity[]
  ) {}
}

export type FilterOf<T extends ComponentFactory[]> = Omit<
  Filter,
  'entities'
> & {
  entities: Array<EntityOf<T>>;
};

export class EntityManager {
  private nextEntityId = 0;

  private entities: Map<Entity, ComponentMap> = new Map();

  private filters: Filter[] = [];

  createEntity() {
    const entity = new Entity(this.nextEntityId++);

    return entity;
  }

  initEntity(entity: Entity, componentMap: ComponentMap) {
    this.entities.set(entity, componentMap);

    // Check and add to filters
    for (const filter of this.filters) {
      if ((componentMap.mask & filter.mask) === filter.mask) {
        filter.entities.push(entity);
      }
    }

    return entity;
  }

  create() {
    return new EntityBuilder(this);
  }

  destroy(entity: Entity) {
    const entityComponents = this.entities.get(entity);

    if (entityComponents != null) {
      for (const filter of this.filters) {
        const index = filter.entities.findIndex(
          (filterEntity) => filterEntity.id === entity.id
        );

        if (index !== -1) {
          filter.entities.splice(index, 1);
        }
      }
    }

    this.entities.delete(entity);
  }

  getEntityComponents(entity: Entity) {
    return this.entities.get(entity);
  }

  createFilter<T extends ComponentFactory[]>(...factories: T) {
    const filtered: Array<EntityOf<T>> = [];
    const mask = factories.reduce(
      (filterMask, factory) => filterMask | factory.mask.value,
      0n
    );

    for (const [entity, componentMap] of this.entities.entries()) {
      if ((componentMap.mask & mask) === mask) {
        filtered.push(entity as any);
      }
    }

    const filter = new Filter(mask, filtered);

    this.filters.push(filter);

    return filter as FilterOf<T>;
  }
}
