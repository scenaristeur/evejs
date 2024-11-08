import {Agent} from './lib/Agent.js';
import {ServiceManager} from './lib/ServiceManager.js';
import {TransportManager} from './lib/TransportManager.js';

// import BabbleModule from './lib/module/BabbleModule.js';
// import PatternModule from './lib/module/PatternModule.js';
// import RequestModule from './lib/module/RequestModule.js';
// import RPCModule from './lib/module/RPCModule.js';

// import Transport from './lib/transport/Transport.js';
// import AMQPTransport from './lib/transport/amqp/AMQPTransport.js';
// import DistribusTransport from './lib/transport/distribus/DistribusTransport.js';
// import HTTPTransport from './lib/transport/http/HTTPTransport.js';
import {LocalTransport} from './lib/transport/local/LocalTransport.js';
// import PubNubTransport from './lib/transport/pubnub/PubNubTransport.js';
// import DBusTransport from './lib/transport/dbus/DBusTransport.js';
// import NanoMsgTransport from './lib/transport/nanomsg/NanoMsgTransport.js';
// import WebSocketTransport from './lib/transport/websocket/WebSocketTransport.js';

// import Connection from './lib/transport/Connection.js';
// import AMQPConnection from './lib/transport/amqp/AMQPConnection.js';
// import DistribusConnection from './lib/transport/distribus/DistribusConnection.js';
// import HTTPConnection from './lib/transport/http/HTTPConnection.js';
import {LocalConnection} from './lib/transport/local/LocalConnection.js';
// import PubNubConnection from './lib/transport/pubnub/PubNubConnection.js';
// import DBusConnection from './lib/transport/dbus/DBusConnection.js';
// import NanoMsgConnection from './lib/transport/nanomsg/NanoMsgConnection.js';
// import WebSocketConnection from './lib/transport/websocket/WebSocketConnection.js';

import hypertimer from 'hypertimer';
import * as util from './lib/util.js';

// Agent.registerModule(BabbleModule);
// Agent.registerModule(PatternModule);
// Agent.registerModule(RequestModule);
// Agent.registerModule(RPCModule);

// TransportManager.registerType(AMQPTransport);
// TransportManager.registerType(DistribusTransport);
// TransportManager.registerType(HTTPTransport);
TransportManager.registerType(LocalTransport);
// TransportManager.registerType(PubNubTransport);
// TransportManager.registerType(DBusTransport);
// TransportManager.registerType(NanoMsgTransport);
// TransportManager.registerType(WebSocketTransport);

const system = new ServiceManager();
system.transports.add(new LocalTransport());

Agent.getTransportById = function (id) {
  return system.transports.get(id);
};

export {
  Agent,
  ServiceManager,
  TransportManager,
  // BabbleModule,
  // PatternModule,
  // RequestModule,
  // RPCModule,
  // Transport,
  // AMQPTransport,
  // DistribusTransport,
  // HTTPTransport,
  LocalTransport,
  // PubNubTransport,
  // DBusTransport,
  // NanoMsgTransport,
  // WebSocketTransport,
  // Connection,
  // AMQPConnection,
  // DistribusConnection,
  // HTTPConnection,
  LocalConnection,
  // PubNubConnection,
  // DBusConnection,
  // NanoMsgConnection,
  // WebSocketConnection,
  hypertimer,
  util,
  system
};

