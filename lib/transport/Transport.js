import Promise from 'promise';
import { v4 as uuidv4 } from 'uuid'

/**
 * Abstract prototype of a transport
 */
export class Transport {
  constructor(config = {}) {
    this.id = config.id || uuidv4();
    this['default'] = config['default'] || false;
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

