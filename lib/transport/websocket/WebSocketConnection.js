import uuid from 'uuid-v4';
import Promise from 'promise';
import WebSocket from (typeof window !== 'undefined' && typeof window.WebSocket !== 'undefined') ?
    window.WebSocket :
    'ws';

import util from '../../util';
import {Connection} from '../Connection';

/**
 * A websocket connection.
 * @param {WebSocketTransport} transport
 * @param {string | number | null} url  The url of the agent. The url must match
 *                                      the url of the WebSocket server.
 *                                      If url is null, a UUID id is generated as url.
 * @param {function} receive
 * @constructor
 */
export class WebSocketConnection extends Connection {
  constructor(transport, url, receive) {
    super();

    this.transport = transport;
    this.url = url ? util.normalizeURL(url) : uuid();
    this.receive = receive;

    this.sockets = {};
    this.closed = false;
    this.reconnectTimers = {};

    // ready state
    this.ready = Promise.resolve(this);
  }

  getMyUrl() {
    return this.url;
  }

  /**
   * Send a message to an agent.
   * @param {string} to   The WebSocket url of the receiver
   * @param {*} message
   * @return {Promise} Returns a promise which resolves when the message is sent,
   *                   and rejects when sending the message failed
   */
  send(to, message) {
    //console.log('send', this.url, to, message); // TODO: cleanup

    // deliver locally when possible
    if (this.transport.localShortcut) {
      var agent = this.transport.agents[to];
      if (agent) {
        try {
          agent.receive(this.url, message);
          return Promise.resolve();
        }
        catch (err) {
          return Promise.reject(err);
        }
      }
    }

    // get or create a connection
    var conn = this.sockets[to];
    if (conn) {
      try {
        if (conn.readyState == conn.CONNECTING) {
          // the connection is still opening
          return new Promise(function (resolve, reject) {
            //console.log(conn.onopen)//, conn.onopen.callback)
            conn.onopen.callbacks.push(function () {
              conn.send(JSON.stringify(message));
              resolve();
            })
          });
        }
        else if (conn.readyState == conn.OPEN) {
          conn.send(JSON.stringify(message));
          return Promise.resolve();
        }
        else {
          // remove the connection
          conn = null;
        }
      }
      catch (err) {
        return Promise.reject(err);
      }
    }

    if (!conn) {
      // try to open a connection
      var me = this;
      return new Promise(function (resolve, reject) {
        me._connect(to, function (conn) {
          conn.send(JSON.stringify(message));
          resolve();
        }, function (err) {
          reject(new Error('Failed to connect to agent "' + to + '"'));
        });
      })
    }
  }

  /**
   * Open a websocket connection to an other agent. No messages are sent.
   * @param {string} to  Url of the remote agent.
   * @returns {Promise.<WebSocketConnection, Error>}
   *              Returns a promise which resolves when the connection is
   *              established and rejects in case of an error.
   */
  connect(to) {
    var me = this;
    return new Promise(function (resolve, reject) {
      me._connect(to, function () {
        resolve(me);
      }, reject);
    });
  }

  /**
   * Open a websocket connection
   * @param {String} to   Url of the remote agent
   * @param {function} [callback]
   * @param {function} [errback]
   * @param {boolean} [doReconnect=false]
   * @returns {WebSocket}
   * @private
   */
  _connect(to, callback, errback, doReconnect) {
    var me = this;
    var conn = new WebSocket(to + '?id=' + this.url);

    // register the new socket
    me.sockets[to] = conn;

    conn.onopen = function () {
      // Change doReconnect to true as soon as we have had an open connection
      doReconnect = true;

      conn.onopen.callbacks.forEach(function (cb) {
        cb(conn);
      });
      conn.onopen.callbacks = [];
    };
    conn.onopen.callbacks = callback ? [callback] : [];

    conn.onmessage = function (event) {
      me.receive(to, JSON.parse(event.data));
    };

    conn.onclose = function () {
      delete me.sockets[to];
      if (doReconnect) {
        me._reconnect(to);
      }
    };

    conn.onerror = function (err) {
      delete me.sockets[to];
      if (errback) {
        errback(err);
      }
    };

    return conn;
  }

  /**
   * Auto reconnect a broken connection
   * @param {String} to   Url of the remote agent
   * @private
   */
  _reconnect(to) {
    var me = this;
    var doReconnect = true;
    if (me.closed == false && me.reconnectTimers[to] == null) {
      me.reconnectTimers[to] = setTimeout(function () {
        delete me.reconnectTimers[to];
        me._connect(to, null, null, doReconnect);
      }, me.transport.reconnectDelay);
    }
  }

  /**
   * Register a websocket connection
   * @param {String} from       Url of the remote agent
   * @param {WebSocket} conn    WebSocket connection
   * @returns {WebSocket}       Returns the websocket itself
   * @private
   */
  _onConnection(from, conn) {
    var me = this;

    conn.onmessage = function (event) {
      me.receive(from, JSON.parse(event.data));
    };

    conn.onclose = function () {
      // remove this connection from the sockets list
      delete me.sockets[from];
    };

    conn.onerror = function (err) {
      // TODO: what to do with errors?
      delete me.sockets[from];
    };

    if (this.sockets[from]) {
      // there is already a connection open with remote agent
      // TODO: what to do with overwriting existing sockets?
      this.sockets[from].close();
    }

    // register new connection
    this.sockets[from] = conn;

    return conn;
  }

  /**
   * Get a list with all open sockets
   * @return {String[]} Returns all open sockets
   */
  list() {
    return Object.keys(this.sockets);
  }

  /**
   * Close the connection. All open sockets will be closed and the agent will
   * be unregistered from the WebSocketTransport.
   */
  close() {
    this.closed = true;

    // close all connections
    for (var id in this.sockets) {
      if (this.sockets.hasOwnProperty(id)) {
        this.sockets[id].close();
      }
    }
    this.sockets = {};

    delete this.transport.agents[this.url];
  }
}



