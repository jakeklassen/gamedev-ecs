const { Component } = require("./component.class");

class RGBA extends Component {
  static index = 2;
  static symbol = Symbol.for(RGBA.name);

  /** @type {number} */
  r;
  /** @type {number} */
  g;
  /** @type {number} */
  b;
  /** @type {number} */
  a;

  /**
   *
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   */
  constructor(r = 0, g = 0, b = 0, a = 0) {
    super();
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}

exports.RGBA = RGBA;
