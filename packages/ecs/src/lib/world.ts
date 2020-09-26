import { EntityBuilder } from './entity-builder';
import { Component, Entity, EntityManager } from './entity-manager';
import { System } from './system';

function componentFactoryInit() {
  let n = 0n;

  return function <N extends string, F extends () => Component>(
    componentName: N,
    factory: F
  ) {
    (factory as any).componentName = componentName;
    const mask = 1n << n++;

    Object.defineProperty(factory, 'mask', {
      writable: false,
      configurable: false,
      value: {
        value: mask,
        index: Number(n - 1n),
      },
    });

    Object.defineProperty(factory, 'componentName', {
      writable: false,
      configurable: false,
      value: componentName,
    });

    return factory as typeof factory & {
      readonly componentName: typeof componentName;
      readonly mask: { value: bigint; index: number };
    };
  };
}

export const component = componentFactoryInit();

/**
 * Container for Systems and Entities
 */
export class World {
  private systems: System[] = [];
  private systemsToRemove: System[] = [];
  private systemsToAdd: System[] = [];
  entityManager = new EntityManager();

  /**
   * Update all world systems
   * @param dt Delta time
   */
  public update(dt: number) {
    this.updateSystems(dt);
  }

  public createEntity(): EntityBuilder {
    return this.entityManager.create();
  }

  /**
   * Delete an entity from the world. Entities can be recycled so do not rely
   * on the deleted entity reference after deleting it.
   * @param entity Entity to delete
   */
  public deleteEntity(entity: Entity) {
    return this.entityManager.destroy(entity);
  }

  /**
   * Register a system for addition. Systems are executed linearly in the order added.
   * @param system System
   */
  public addSystem(system: System) {
    this.systemsToAdd.push(system);
  }

  /**
   * Register a system for removal.
   * @param system System
   */
  public removeSystem(system: System) {
    this.systemsToRemove.push(system);
  }

  public updateSystems(dt: number) {
    if (this.systemsToRemove.length > 0) {
      this.systems = this.systems.filter((existing) =>
        this.systemsToRemove.includes(existing)
      );

      this.systemsToRemove = [];
    }

    if (this.systemsToAdd.length > 0) {
      this.systemsToAdd.forEach((newSystem) => {
        if (this.systems.includes(newSystem) === false) {
          this.systems.push(newSystem);
        }
      });

      this.systemsToAdd = [];
    }

    for (const system of this.systems) {
      system.update(this, dt);
    }
  }
}
