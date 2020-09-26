const { Component } = require("./component.class");

class Velocity extends Component {
  static index = 1;
  static symbol = Symbol.for(Velocity.name);

  /** @type {number} */
  x;
  /** @type {number} */
  y;

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x = 0, y = 0) {
    super();
    this.x = x;
    this.y = y;
  }
}

exports.Velocity = Velocity;
