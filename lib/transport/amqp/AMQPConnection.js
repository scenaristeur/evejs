import Promise from 'promise';
import Connection from '../Connection';

/**
 * A local connection.
 */
export default class AMQPConnection extends Connection {
  /**
   * @param {AMQPTransport} transport
   * @param {string | number} id
   * @param {function} receive
   */
  constructor(transport, id, receive, connReady) {
    super();
    this.transport = transport;
    this.id = id;
    this.channel = null;

    this.ready = new Promise((resolve, reject) => {
      connReady.then(() => {
        this.transport.connection.createChannel((err, ch) => {
          if (err != null) {
            console.error(err);
            reject();
          } else {
            this.channel = ch;
            ch.assertQueue(this.id);
            ch.consume(this.id, (message) => {
              if (message !== null && message.content && message.content.toString() != "") {
                var body = JSON.parse(message.content.toString());
                if (body.to != this.id) {
                  console.warn("Received message not meant for me?", body);
                } else {
                  receive(body.from, body.message);
                }
                ch.ack(message);
              }
            });
            resolve();
          }
        });
      });
    })
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
  send(to, message) {
    if (this.channel != null) {
      var msg = {
        from: this.id,
        to: to,
        message: message
      };
      this.channel.sendToQueue(to, new Buffer(JSON.stringify(msg), "utf-8"));
    } else {
      console.log("No channel open");
    }
  }

  /**
   * Close the connection
   */
  close() {
    if (this.channel != null) {
      this.channel.close();
    }
    this.channel = null;
  }
}

