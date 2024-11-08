import HelloAgent from './agents/HelloAgent.js';

// create two agents
const agent1 = new HelloAgent('agent1');
const agent2 = new HelloAgent('agent2');

// send a message to agent1
agent2.send('agent1', 'Hello agent1!');

