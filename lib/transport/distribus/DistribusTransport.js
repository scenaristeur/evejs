import distribus from 'distribus';
import {Transport} from './../Transport.js';
import {DistribusConnection} from './DistribusConnection.js';

/**
 * Use distribus as transport
 * @param {Object} config         Config can contain the following properties:
 *                                - `id: string`. Optional
 *                                - `host: distribus.Host`. Optional
 *                                If `host` is not provided,
 *                                a new local distribus Host is created.
 * @constructor
 */
export class DistribusTransport extends Transport {
  /**
   * @param {Object} config
   */
  constructor(config) {
    super();
    this.id = config && config.id || null;
    this['default'] = config && config['default'] || false;
    this.host = config && config.host || new distribus.Host(config);

    this.networkId = this.host.networkId; // FIXME: networkId can change when host connects to another host.
  }

  static type='distribus'
  /**
   * Connect an agent
   * @param {String} id
   * @param {Function} receive     Invoked as receive(from, message)
   * @return {DistribusConnection} Returns a connection.
   */
  connect(id, receive) {
    return new DistribusConnection(this, id, receive);
  }

  /**
   * Close the transport.
   */
  close() {
    this.host.close();
    this.host = null;
  }
}

