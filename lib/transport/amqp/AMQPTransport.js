import Promise from 'promise';
import Transport from './../Transport';
import AMQPConnection from './AMQPConnection';
import * as AMQP from 'amqplib/callback_api';

/**
 * Use AMQP as transport
 * @param {Object} config   Config can contain the following properties:
 *                          - `id: string`
 *                          - `url: string`
 *                          - `host: string`
 *                          The config must contain either `url` or `host`.
 *                          For example: {url: 'amqp://localhost'} or
 *                          {host: 'dev.rabbitmq.com'}
 * @constructor
 */
export default class AMQPTransport extends Transport {
  /**
   * @param {Object} config
   */
  constructor(config) {
    super();
    this.id = config.id || null;
    this.url = config.url || (config.host && `amqp://${config.host}`) || null;
    this['default'] = config['default'] || false;
    this.networkId = this.url;
    this.connection = null;
    this.config = config;
  }

  /**
   * Connect an agent
   * @param {String} id
   * @param {Function} receive     Invoked as receive(from, message)
   * @return {AMQPConnection} Returns a connection.
   */
  connect(id, receive) {
    var me = this;
    var ready = new Promise(function (resolve, reject) {
      if (me.connection == null) {
        AMQP.connect(me.url, function (err, conn) {
          if (err != null) {
            console.error(err);
          } else {
            me.connection = conn;
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
    return new AMQPConnection(me, id, receive, ready);
  }

  /**
   * Close the transport.
   */
  close() {
    if (this.connection != null) {
      this.connection.close();
      this.connection = null;
    }
  }
}

