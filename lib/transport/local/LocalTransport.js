import {Transport} from './../Transport.js';
import {LocalConnection} from './LocalConnection.js';

/**
 * Create a local transport.
 * @param {Object} config         Config can contain the following properties:
 *                                - `id: string`. Optional
 * @constructor
 */
export  class LocalTransport extends Transport {
  constructor(config) {
    super();
    this.id = config && config.id || null;
    this.networkId = this.id || null;
    this.default = config && config['default'] || false;
    this.agents = {};
  }
  static type = "local";
  /**
   * Connect an agent
   * @param {String} id
   * @param {Function} receive                  Invoked as receive(from, message)
   * @return {LocalConnection} Returns a promise which resolves when
   *                                                connected.
   */
  connect(id, receive) {
    return new LocalConnection(this, id, receive);
  }

  /**
   * Close the transport. Removes all agent connections.
   */
  close() {
    this.agents = {};
  }
}

