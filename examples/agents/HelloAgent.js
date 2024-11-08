import * as eve from '../../index.js';

/**
 * Custom agent class
 * @extend eve.Agent
 */
class HelloAgent extends eve.Agent {
  /**
   * Constructor for HelloAgent
   * @param {String} id
   */
  constructor(id) {
    // execute super constructor
    super(id);

    // connect to all transports configured by the system
    this.connect(eve.system.transports.getAll());
  }

  /**
   * Send a greeting to an agent
   * @param {String} to
   */
  sayHello(to) {
    this.send(to, `Hello ${to}!`).done();
  }

  /**
   * Handle incoming greetings. This overloads the default receive,
   * so we can't use HelloAgent.on(pattern, listener) anymore
   * @param {String} from     Id of the sender
   * @param {*} message       Received message, a JSON object (often a string)
   */
  receive(from, message) {
    console.log(`${from} said: ${JSON.stringify(message)}`);

    if (message.indexOf('Hello') === 0) {
      // reply to the greeting
      this.send(from, 'Hi ' + from + ', nice to meet you!').done();
    }
  }
}

export default HelloAgent;

