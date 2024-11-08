'use strict';

import { parse as parseUrl } from 'url';
import uuid from 'uuid-v4';
import Promise from 'promise';

import * as util from '../../util.js';
import {Transport} from '../Transport.js';
import {WebSocketConnection} from './WebSocketConnection.js';
import { Server as WebSocketServer } from 'ws';

/**
 * Create a web socket transport.
 * @param {Object} config         Config can contain the following properties:
 *                                - `id: string`. Optional
 *                                - `default: boolean`. Optional
 *                                - `url: string`. Optional. If provided,
 *                                  A WebSocket server is started on given
 *                                  url.
 *                                - `localShortcut: boolean`. Optional. If true
 *                                  (default), messages to local agents are not
 *                                  send via WebSocket but delivered immediately
 *                                - `reconnectDelay: number` Optional. Delay in
 *                                  milliseconds for reconnecting a broken
 *                                  connection. 10000 ms by default. Connections
 *                                  are only automatically reconnected after
 *                                  there has been an established connection.
 * @constructor
 */
class WebSocketTransport extends Transport {
  constructor(config) {
    super();
    this.id = config?.id || null;
    this.networkId = this.id || null;
    this.default = config?.default || false;
    this.localShortcut = config?.localShortcut !== false;
    this.reconnectDelay = config?.reconnectDelay || 10000;

    this.httpTransport = config?.httpTransport;

    this.url = config?.url || null;
    this.server = null;

    if (this.url != null) {
      const urlParts = parseUrl(this.url);

      if (urlParts.protocol !== 'ws:') throw new Error('Invalid protocol, "ws:" expected');
      if (!this.url.includes(':id')) throw new Error('":id" placeholder missing in url');

      this.address = `${urlParts.protocol}//${urlParts.host}`; // the url without path, for example 'ws://localhost:3000'
      this.ready = this._initServer(this.url);
    } else {
      this.address = null;
      this.ready = Promise.resolve(this);
    }

    this.agents = {}; // WebSocketConnections of all registered agents. The keys are the urls of the agents
  }

  type = 'ws';

  /**
   * Build an url for given id. Example:
   *   var url = getUrl('agent1'); // 'ws://localhost:3000/agents/agent1'
   * @param {String} id
   * @return {String} Returns the url, or returns null when no url placeholder
   *                  is defined.
   */
  getUrl(id) {
    return this.url ? this.url.replace(':id', id) : null;
  }

  /**
   * Initialize a server on given url
   * @param {String} url    For example 'http://localhost:3000'
   * @return {Promise} Returns a promise which resolves when the server is up
   *                   and running
   * @private
   */
  _initServer(url) {
    const urlParts = parseUrl(url);
    const port = urlParts.port || 80;

    return new Promise((resolve, reject) => {
      if (this.httpTransport !== undefined) {
        console.log("WEBSOCKETS: using available server.");
        this.server = new WebSocketServer({ server: this.httpTransport.server }, () => {
          resolve(this);
        });
      } else {
        this.server = new WebSocketServer({ port: port }, () => {
          resolve(this);
        });
      }

      this.server.on('connection', this._onConnection.bind(this));

      this.server.on('error', (err) => {
        reject(err)
      });
    });
  }

  /**
   * Handle a new connection. The connection is added to the addressed agent.
   * @param {WebSocket} conn
   * @private
   */
  _onConnection(conn, req) {
    const url = req.url;
    const urlParts = parseUrl(url, true);
    const toPath = urlParts.pathname;
    const to = util.normalizeURL(this.address + toPath);

    // read sender id from query parameters or generate a random uuid
    const queryParams = urlParts.query;
    const from = queryParams.id || uuid();

    const agent = this.agents[to];
    if (agent) {
      agent._onConnection(from, conn);
    } else {
      conn.close();
    }
  }

  /**
   * Connect an agent
   * @param {string} id     The id or url of the agent. In case of an
   *                        url, this url should match the url of the
   *                        WebSocket server.
   * @param {Function} receive                  Invoked as receive(from, message)
   * @return {WebSocketConnection} Returns a promise which resolves when
   *                                                connected.
   */
  connect(id, receive) {
    const isURL = id.includes('://');

    let url = isURL ? id : (this.getUrl(id) || id);
    if (url) url = util.normalizeURL(url);

    // register the agents receive function
    if (this.agents[url]) {
      throw new Error(`Agent with id ${this.id} already exists`);
    }

    const conn = new WebSocketConnection(this, url, receive);
    this.agents[conn.url] = conn; // use conn.url, url can be changed when it was null

    return conn;
  }

  /**
   * Close the transport. Removes all agent connections.
   */
  close() {
    // close all connections
    for (const id in this.agents) {
      if (this.agents.hasOwnProperty(id)) {
        this.agents[id].close();
      }
    }
    this.agents = {};

    // close the server
    if (this.server) {
      this.server.close();
    }
  }
}

export default WebSocketTransport;

