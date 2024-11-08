import {Transport} from './../Transport.js';
import {LocalConnection} from './LocalConnection.js';
import { v4 as uuidv4 } from 'uuid'

/**
 * Create a local transport.
 * @param {Object} config         Config can contain the following properties:
 *                                - `id: string`. Optional
 * @constructor
 */
export  class LocalTransport extends Transport {
  constructor(config) {
    super(config);
    this.id = config && config.id || uuidv4();
    this.networkId = this.id 
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
    // console.warn ("----------localtransport connect", id, receive)
    let connection = new LocalConnection(this, id, receive);
    // connection.send("agent1", 'tjyfj')
    console.warn("*******************CONNECTION", connection)
    return connection
  }

  /**
   * Close the transport. Removes all agent connections.
   */
  close() {
    this.agents = {};
  }
}

