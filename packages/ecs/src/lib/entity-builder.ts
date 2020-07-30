import { ComponentMap2 } from './component-map-2';
import { ComponentFactory, Entity, EntityManager } from './entity-manager';

export class EntityBuilder {
  private componentMap: ComponentMap2;
  private entity: Entity;
  private entityManager: EntityManager;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager;
    this.entity = entityManager.createEntity();
    this.componentMap = new ComponentMap2(this.entity);
  }

  with<T extends ComponentFactory>(
    factory: T,
    component: ReturnType<typeof factory>
  ) {
    this.componentMap.set(factory, component);

    return this;
  }

  build() {
    return this.entityManager.initEntity(this.entity, this.componentMap);
  }
}
