
> evejs@0.6.1 test
> mocha test --recursive --reporter spec



  Agent
    creation
      ✔ should create an agent without id
      ✔ should create an agent with id
    transport
      ✔ should send a message via a transport
      ✔ should connect with an alternative id
      ✔ should connect to a transport by id
      ✔ should disconnect from a transport by id
      ✔ should connect and disconnect multiple transports at once
      ✔ should disconnect all transports at once
      ✔ should send a message with agentId@transportId notation
      - should send a message with protocol://networkId/agentId notation
      ✔ should send a message with the default transport
      ✔ should send a message via websocket transport
      ✔ should throw an error when sending a message without transport configured

  ServiceManager
    ✔ should create a service manager
    ✔ should create a service manager with config
    ✔ should configure the timer
    ✔ should configure the random function
    ✔ should configure the random function with custom seed

  TransportManager
    ✔ should create a transport manager
    ✔ should register a new transport type
    ✔ should throw an error when registering an already existing transport type
    ✔ should add a loaded transport
    ✔ should load a transport from config
    ✔ should load a transport manager with config object
    ✔ should find all transports
    ✔ should find a transport by id
    ✔ should find a transport by id
    ✔ should throw an error when a transport could not be found
    ✔ should find all transports by type
    ✔ should unload a transport by instance
    ✔ should unload a transport by id
    ✔ should unload multiple transports
    ✔ should clear all transports
    ✔ should throw an error when finding an unknown type of transport

  Pattern
    ✔ should add and remove a pattern listener
    ✔ should add and remove a pattern listener using loadModule
    ✔ should listen to messages using a string pattern
    ✔ should listen to messages using a regexp pattern
    ✔ should listen to messages using a function pattern
    ✔ should deliver a message to multiple matching listeners
    ✔ should deliver a message to the first matching listeners

  RPC
    ✔ should load an RPC module
    ✔ should extend the agent with an RPC module
    ✔ should catch not having a method
    ✔ should catch agent not found
    ✔ should catch method not found
    ✔ should catch message not an object
    ✔ should catch undefined return value
    ✔ should catch no message
    ✔ should understand a promise as reply
    ✔ should be possible to interchange then and done
    ✔ should catch an error when promise as reply and is rejected
    ✔ should propagate error and catch
    ✔ should give error and catch
    ✔ should give error and catch

  Request
    ✔ should send a request and receive a reply
    ✔ should send a request and receive a reply (loaded via loadModule)
    ✔ should send a request and get a timeout if no reply is send (51ms)
    ✔ should send a request and receive a reply resolved by a promise (51ms)
    ✔ should retrurn a reply resolved by a pattern listener
    ✔ should retrurn a reply resolved by a pattern listener (2)
    ✔ should handle errors thrown by the agents receive method
    ✔ should handle errors returned via rejected promise

  HTTPTransport
Server listening at  http://127.0.0.1:3000/agents/:id
    ✔ should create an HTTPTransport with default settings
    ✔ should create an HTTPTransport with localShortcut==false
    ✔ should receive a message sent over http
    ✔ should receive a reply sent over http
    ✔ should get error that agent is not found
    ✔ should not be able to connect (1001ms)
    ✔ should send a request and receive a reply in the same connection
    ✔ should deliver reply on the same line (104ms)
    ✔ should deliver reply if the same line is closed (304ms)
    ✔ Request - should not be able to deliver this message and catch error (1000ms)
    ✔ RPC - should not be able to deliver this message and catch error (1001ms)

  LocalTransport
    ✔ should create a LocalTransport
    ✔ should create a LocalTransport with id
    ✔ should connect and disconnect to LocalTransport

  MultiTransport on the same port
Server listening at  http://127.0.0.1:3000/agents/:id
WEBSOCKETS: using available server.
    ✔ Should be able to use websockets and HTTP on the same port

  WebSocketTransport
    ✔ should create a WebSocketTransport with default config
    ✔ should create a WebSocketTransport with id
    ✔ should create a WebSocketTransport with localShortcut==false
    ✔ should throw an error when configuring an invalid url
    ✔ should send a message via localShortcut
    ✔ should send a message via socket
    ✔ should open a socket via connect, test list
    ✔ should send a message via an anonymous socket
    ✔ should auto-reconnect a broken websocket connection (211ms)
    ✔ should throw an error when agent is not found
    ✔ should correctly handle multiple messages

  util
    ✔ should check whether an object is a Promise using ducktyping
    ✔ should normalize an url


  90 passing (4s)
  1 pending

