import { ComponentMap2 } from './component-map-2';
import { EntityBuilder } from './entity-builder';

export type SimpleType = string | number | bigint | boolean | null;

export type Component = {
  [key: string]: SimpleType | Array<SimpleType | Component> | Component;
};

export type ComponentFactory = {
  name: string;
  (): Component;
  mask: {
    value: bigint;
    index: number;
  };
};

export type EntityId = number;

export class Entity {
  id: EntityId = 0;
  [key: string]: any;
}

export class Filter {
  constructor(
    public readonly mask: bigint,
    public readonly entities: Entity[]
  ) {}
}

export class EntityManager {
  private nextEntityId = 0;

  private entities: Map<Entity, ComponentMap2> = new Map();

  private filters: Filter[] = [];

  createEntity() {
    const entity = new Entity();
    entity.id = this.nextEntityId++;

    return entity;
  }

  initEntity(entity: Entity, componentMap: ComponentMap2) {
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

  createFilter(...factories: ComponentFactory[]) {
    const filtered: Entity[] = [];
    const mask = factories.reduce(
      (filterMask, factory) => filterMask | factory.mask.value,
      0n
    );

    for (const [entity, componentMap] of this.entities.entries()) {
      if ((componentMap.mask & mask) === mask) {
        filtered.push(entity);
      }
    }

    const filter = new Filter(mask, filtered);

    this.filters.push(filter);

    return filter;
  }
}
