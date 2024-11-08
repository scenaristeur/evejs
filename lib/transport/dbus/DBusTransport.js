import {Transport} from '../Transport';
import {DBusConnection} from './DBusConnection';

/**
 * Use DBus as transport
 * @param {Object} config         Config can contain the following properties
 * @constructor
 */
export class DBusTransport extends Transport {
  /**
   * @param {Object} config
   */
  constructor(config) {
    super();
    this.config = config;
  }

  /**
   * Connect an agent
   * @param {String} id
   * @param {Function} receive  Invoked as receive(from, message)
   * @return {DBusConnection} Returns a connection
   */
  connect(id, receive) {
    return new DBusConnection(this, id, receive)
  }

  /**
   * Close the transport.
   */
  close() {
  }
}

