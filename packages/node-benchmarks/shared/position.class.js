const { Component } = require("./component.class");

class Position extends Component {
  static index = 0;
  static symbol = Symbol.for(Position.name);

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

exports.Position = Position;
