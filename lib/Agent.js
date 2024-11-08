

/**
 * Agent
 * @param {string} [id]         Id for the agent. If not provided, the agent
 *                              will be given a uuid.
 * @constructor
 */


export class Agent {


  constructor(id) {
    this.id = id ? id.toString() : uuid();

    // a list with all connected transports
    this.connections = [];
    this.defaultConnection = null;
    this.ready = Promise.resolve([]);

  }

}