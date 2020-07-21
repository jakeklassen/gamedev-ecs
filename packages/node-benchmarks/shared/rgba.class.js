class RGBA {
  static index = 1;

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
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}

exports.RGBA = RGBA;
