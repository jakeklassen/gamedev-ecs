import { ComponentMap } from './component-map';
import { EntityBuilder } from './entity-builder';

export type SimpleType = string | number | bigint | boolean | null;

export type Component = {
  [key: string]: SimpleType | Array<SimpleType | Component> | Component;
};

export type ComponentFactory = {
  (): Component;
  mask: {
    value: bigint;
    index: number;
  };
};

export type EntityId = number;

export class Entity {
  id: EntityId = 0;
}

export class Filter {
  constructor(
    public readonly mask: bigint,
    public readonly componentMaps: ComponentMap[]
  ) {}
}

export class EntityManager {
  private nextEntityId = 0;

  private entities: Map<Entity, ComponentMap> = new Map();

  private filters: Map<Filter, ComponentMap[]> = new Map();

  createEntity() {
    const entity = new Entity();
    entity.id = this.nextEntityId++;

    return entity;
  }

  initEntity(entity: Entity, componentMap: ComponentMap) {
    this.entities.set(entity, componentMap);

    // Check and add to filters
    for (const [filter, entities] of this.filters.entries()) {
      if ((componentMap.mask & filter.mask) === filter.mask) {
        entities.push(componentMap);
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
      for (const [_filter, componentMaps] of this.filters.entries()) {
        const index = componentMaps.findIndex(
          (componentMap) => componentMap.entity.id === entity.id
        );

        if (index !== -1) {
          componentMaps.splice(index, 1);
        }
      }
    }

    this.entities.delete(entity);
  }

  getEntityComponents(entity: Entity) {
    return this.entities.get(entity);
  }

  createFilter(...factories: ComponentFactory[]) {
    const filtered: ComponentMap[] = [];
    const mask = factories.reduce(
      (filterMask, factory) => filterMask | factory.mask.value,
      0n
    );

    for (const [_entity, componentMap] of this.entities.entries()) {
      if ((componentMap.mask & mask) === mask) {
        filtered.push(componentMap);
      }
    }

    const filter = new Filter(mask, filtered);

    this.filters.set(filter, filtered);

    return filter;
  }
}
