import Promise from 'promise';
import {Connection} from '../Connection.js';

/**
 * A local connection.
 * @param {LocalTransport} transport
 * @param {string | number} id
 * @param {function} receive
 * @constructor
 */
export class LocalConnection extends Connection {
  constructor(transport, id, receive) {
    super();
    this.transport = transport;
    this.id = id;

    // register the agents receive function
    if (this.id in this.transport.agents) {
      throw new Error('Agent with id ' + id + ' already exists');
    }
    this.transport.agents[this.id] = receive;

    // ready state
    this.ready = Promise.resolve(this);
  }

  getMyUrl(){
    return this.transport.type +":"+this.id;
  }

  /**
   * Send a message to an agent.
   * @param {string} to
   * @param {*} message
   * @return {Promise} returns a promise which resolves when the message has been sent
   */
  send (to, message) {
    var query = to.replace("local:","").split("?");
    var callback = this.transport.agents[query[0]];
    if (!callback) {
      return Promise.reject(new Error('Agent with id ' + to + ' not found'));
    }

    var queryParams = query[1] ? query[1].split("&"):[];
    // invoke the agents receiver as callback(from, message, queryparameters)
    callback("local:"+this.id, message, queryParams);

    return Promise.resolve();
  }

  /**
   * Close the connection
   */
  close () {
    delete this.transport.agents[this.id];
  }
}



