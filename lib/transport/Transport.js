import Promise from 'promise';

/**
 * Abstract prototype of a transport
 */
export class Transport {
  constructor(config = {}) {
    this.id = config.id || null;
    this['default'] = config['default'] || false;
    this.type = null
  }


  static type = null;
  /**
   * Connect an agent
   * @param {String} id
   * @param {Function} receive  Invoked as receive(from, message)
   * @return {Connection}       Returns a connection
   */
  connect(id, receive) {
    throw new Error('Cannot invoke abstract function "connect"');
  }

  /**
   * Close the transport
   */
  close() {
    throw new Error('Cannot invoke abstract function "close"');
  }
}

