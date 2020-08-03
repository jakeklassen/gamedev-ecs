/**
 * @abstract
 */
class Component {
  /**
   * @readonly
   */
  #component = true;

  /**
   * @type {number}
   */
  static index;

  /**
   * @type {symbol}
   */
  static symbol;

  /**
   * @protected
   */
  constructor() {}
}

exports.Component = Component;
