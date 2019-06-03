exports.Agent = require('./lib/Agent');
exports.ServiceManager = require('./lib/ServiceManager');
exports.TransportManager = require('./lib/TransportManager');
var RequestModule = require('./lib/module/RequestModule');


exports.transport = {
  LocalTransport:     require('./lib/transport/local/LocalTransport')
};

exports.TransportManager.registerType(exports.transport.LocalTransport);

// load the default ServiceManager, a singleton, initialized with a LocalTransport
exports.system = new exports.ServiceManager();
exports.system.transports.add(new exports.transport.LocalTransport());

// override Agent.getTransportById in order to support Agent.connect(transportId)
exports.Agent.getTransportById = function (id) {
  return exports.system.transports.get(id);
};

exports.Agent.registerModule(RequestModule);
