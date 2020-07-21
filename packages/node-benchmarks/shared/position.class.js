class Position {
  static index = 0;

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
    this.x = x;
    this.y = y;
  }
}

exports.Position = Position;
