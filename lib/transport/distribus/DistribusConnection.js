import Promise from 'promise';
import {Connection} from '../Connection.js';

/**
 * A local connection.
 * @param {DistribusTransport} transport
 * @param {string | number} id
 * @param {function} receive
 * @constructor
 */
export class DistribusConnection extends Connection {
  /**
   * @param {DistribusTransport} transport
   * @param {string | number} id
   * @param {function} receive
   */
  constructor(transport, id, receive) {
    super();
    this.transport = transport;
    this.id = id;

    // create a peer
    const peer = this.transport.host.create(id);
    peer.on('message', receive);

    // ready state
    this.ready = Promise.resolve(this);
  }

  /**
   * @return {string} Returns a string representing a url to this connection
   */
  getMyUrl() {
    return `${this.transport.type}:${this.id}`;
  }

  /**
   * Send a message to an agent.
   * @param {string} to
   * @param {*} message
   * @return {Promise} returns a promise which resolves when the message has been sent
   */
  send(to, message) {
    return this.transport.host.send(this.id, to, message);
  }

  /**
   * Close the connection
   */
  close() {
    this.transport.host.remove(this.id);
  }
}



