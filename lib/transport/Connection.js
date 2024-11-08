'use strict';

import Promise from 'promise';

/**
 * An abstract Transport connection
 * @param {Transport} transport
 * @param {string} id
 * @param {function} receive
 * @constructor
 * @abstract
 */
export class Connection {
  constructor(transport, id, receive) {
    throw new Error('Cannot create an abstract Connection');
  }

  static get ready() {
    return Promise.reject(new Error('Cannot get abstract property ready'));
  }

  /**
   * Send a message to an agent.
   * @param {string} to
   * @param {*} message
   * @return {Promise} returns a promise which resolves when the message has been sent
   */
  send(to, message) {
    throw new Error('Cannot call abstract function send');
  }

  /**
   * Close the connection, disconnect from the transport.
   */
  close() {
    throw new Error('Cannot call abstract function "close"');
  }

  getMyUrl() {
    return `${this.transport.type}:${this.id}`;
  }
}



