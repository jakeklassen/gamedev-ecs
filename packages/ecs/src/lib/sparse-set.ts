import { Component, Entity } from './entity-manager';

export class SparseSet<T extends Component> {
  #sparse: number[] = [];
  #dense: T[] = [];
  #size = 0;

  log() {
    console.log(this.#size, this.#sparse, this.#dense);
  }

  insert(entity: Entity, value: T) {
    if (!this.lookup(entity, value)) {
      this.#dense[this.#size] = value;
      this.#sparse[entity.id] = this.#size;
      this.#size++;
    }
  }

  get(entity: Entity) {
    return this.#dense[this.#sparse[entity.id]];
  }

  lookup(entity: Entity, value: T) {
    return (
      this.#sparse[entity.id] < this.#size &&
      this.#sparse[entity.id] != null &&
      this.#dense[this.#sparse[entity.id]].constructor === value.constructor
    );
  }

  clear() {
    this.#size = 0;
  }
}
