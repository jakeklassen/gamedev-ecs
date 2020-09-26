const { Component } = require("./component.class");

/**
 * @template {Component} T
 */
class SparseSet {
  /**
   * @type {Array<number>}
   */
  #sparse = [];

  /**
   * @type {Array<T>}
   */
  #dense = [];

  #size = 0;

  log() {
    console.log(this.#size, this.#sparse, this.#dense);
  }

  /**
   *
   * @param {number} entity
   * @param {T} value
   */
  insert(entity, value) {
    if (!this.lookup(entity, value)) {
      this.#dense[this.#size] = value;
      this.#sparse[entity] = this.#size;
      this.#size++;
    }
  }

  /**
   *
   * @param {number} entity
   */
  get(entity) {
    return this.#dense[this.#sparse[entity]];
  }

  /**
   *
   * @param {number} entity
   * @param {T} value
   */
  lookup(entity, value) {
    return (
      this.#sparse[entity] < this.#size &&
      this.#sparse[entity] != null &&
      this.#dense[this.#sparse[entity]].constructor === value.constructor
    );
  }

  clear() {
    this.#size = 0;
  }
}

exports.SparseSet = SparseSet;
