var babble = require('babble');

/**
 * Create a Babble module for an agent.
 * The agents _receive function is wrapped into a new handler.
 * Creates a Babble instance with function `ask`, `tell`, `listen`, `listenOnce`
 * @param {Agent} agent
 * @param {Object} options  TODO: describe options
 * @constructor
 */
function BabbleModule(agent, options) {
  var receiveName = options && options.receive || 'receive';
  var receiveOriginal = agent[receiveName] || null;
  var queue = [];

  // create a new babbler
  var babbler = babble.babbler(agent.id);

  // attach receive function to the agent
  if (receiveOriginal) {
    this.receive = agent[receiveName] = function (from, message) {
      babbler._receive(message);
      // TODO: only propagate to receiveOriginal if the message is not handled by the babbler
      return receiveOriginal.call(agent, from, message);
    };
  }
  else {
    this.receive = agent[receiveName] = function (from, message) {
      return babbler._receive(message);
    };
  }

  /**
   * Remove request features from the agent
   */
  this.destroy = function () {
    if (agent[receiveName] === this.receive) {
      if (receiveOriginal) {
        agent[receiveName] = receiveOriginal;
      }
      else {
        delete agent[receiveName];
      }
    }
    if (agent.ask === this.ask)               delete agent.ask;
    if (agent.tell === this.tell)             delete agent.tell;
    if (agent.listen === this.listen)         delete agent.listen;
    if (agent.listenOnce === this.listenOnce) delete agent.listenOnce;
  };

  this.ask = babbler.ask.bind(babbler);
  this.tell = babbler.tell.bind(babbler);
  this.listen = babbler.listen.bind(babbler);
  this.listenOnce = babbler.listenOnce.bind(babbler);

  if (options && options.extend) {
    // check for conflicts
    ['ask', 'tell', 'listen', 'listenOnce'].forEach(function (prop) {
      if (agent[prop] !== undefined) {
        throw new Error('Conflict: agent already has a property "' + prop + '"');
      }
    });

    // extend the agent with the functions provided by Babble
    agent.ask = this.ask;
    agent.tell = this.tell;
    agent.listen = this.listen;
    agent.listenOnce = this.listenOnce;
  }
}

module.exports = BabbleModule;