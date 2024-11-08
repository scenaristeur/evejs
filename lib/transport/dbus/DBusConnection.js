import Promise from 'promise';
import Connection from '../Connection';
import dbus from "dbus-native";

/**
 * A connection. The connection is ready when the property .ready resolves.
 * @param {DBusTransport} transport
 * @param {string | number} id
 * @param {function} receive
 * @constructor
 */

const serviceName = "com.almende.eve";
const interfaceName = "com.almende.eve.agent";
const objectName = "/agent/";
let loaded = false;
let outBus;
let inBus;

class DBusConnection extends Connection {
  constructor(transport, id, receive) {
    super(transport, id, receive);
    if (!loaded) {
      if (transport.config && transport.config.systembus) {
        outBus = dbus.systemBus();
        inBus = dbus.systemBus();
      } else {
        outBus = dbus.sessionBus();
        inBus = dbus.sessionBus();
      }
      loaded = true;
    }
    if (transport.config && transport.config.url) {
      const parsed = this.fromUrl(transport.config.url);
      if (parsed.objectName) {
        this.objectName = parsed.objectName;
        this.serviceName = parsed.serviceName;
        this.url = "dbus:" + parsed.serviceName + parsed.objectName + id;
      }
    }
    if (!this.url || !this.url.startsWith("dbus:")) {
      this.url = "dbus:" + serviceName + objectName + id;
      this.objectName = objectName;
      this.serviceName = serviceName;
    }
  }

  getMyUrl() {
    return this.url;
  }

  fromUrl(url) {
    if (url.startsWith("dbus:")) {
      const sn = url.substring(url.indexOf(":") + 1, url.indexOf("/"));
      const on = url.substring(url.indexOf("/")).replace(":id", "");

      return {
        serviceName: sn,
        objectName: on
      }
    } else {
      return {
        serviceName: this.serviceName,
        objectName: this.objectName + url
      }
    }
  }

  /**
   * Send a message to an agent.
   * @param {string} to
   * @param {*} message
   * @return {Promise} returns a promise which resolves when the message has been sent
   */
  send(to, message) {
    const me = this;
    const parsed = me.fromUrl(to);
    if (!parsed.objectName) {
      return Promise.reject();
    }
    const peerName = parsed.objectName;
    const peerServiceName = parsed.serviceName;
    return new Promise((resolve, reject) => {

      const service = outBus.getService(peerServiceName);
      service.getInterface(peerName, interfaceName, (e, iface) => {
        if (e) {
          console.log('Failed to request interface \'' + interfaceName + '\' at \'' + peerName + '\' : ' + e ? e : '(no error)')
          reject();
          return;
        }
        if (typeof message !== "string") {
          message = JSON.stringify(message);
        }
        iface.receive(message, me.url, (e, res) => {
          if (e) {
            console.log('Failed to call receive on agent ' + to + ': ' + e ? e : '(no error)')
            reject();
          } else {
            resolve();
          }
        });

      });

    });
  }

  /**
   * Close the connection
   */
  close() {

  }
}

export default DBusConnection;

