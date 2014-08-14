var assert = require('assert');
var Actor = require('../lib/Actor');
var LocalTransport = require('../lib/transport/LocalTransport');

describe('Actor', function() {

  describe ('creation', function () {

    it('should create an Actor without id', function () {
      var actor = new Actor();
      assert.ok(actor instanceof Actor);
      assert.ok(actor.id && actor.id.length);
    });

    it('should create an Actor with id', function () {
      var actor = new Actor('actor1');
      assert.ok(actor instanceof Actor);
      assert.equal(actor.id, 'actor1');
    });
  });

  describe ('message listeners', function () {

    it('should add and remove a message listener', function () {
      var actor = new Actor('actor1');
      var sender = 'actor2';
      var count = 0;

      var pattern = 'hello';
      var listener = function (from, message) {
        assert.equal(from, sender);
        count++;
      };

      // add the listener, test if listener is triggered
      actor.on(pattern, listener);
      actor.onMessage(sender, pattern);
      assert.equal(count, 1);

      // remove the listener, test if listener is not triggered anymore
      actor.off(pattern, listener);
      actor.onMessage(sender, pattern);
      assert.equal(count, 1);
    });

    it('should listen to messages using a string pattern', function (done) {
      var actor = new Actor('actor1');

      actor.on('hello', function (from, message) {
        assert.equal(from, 'actor2');
        assert.equal(message, 'hello');
        done();
      });

      actor.onMessage('actor2', 'hello');
    });

    it('should listen to messages using a regexp pattern', function (done) {
      var actor = new Actor('actor1');

      actor.on(/hello/, function (from, message) {
        assert.equal(from, 'actor2');
        assert.equal(message, 'hello, my name is actor2');
        done();
      });

      actor.onMessage('actor2', 'hi there'); // this message should be ignored
      actor.onMessage('actor2', 'hello, my name is actor2');
    });

    it('should listen to messages using a function pattern', function (done) {
      var actor = new Actor('actor1');

      actor.on(function (message) {
        return message.indexOf('hello') != -1;
      }, function (from, message) {
        assert.equal(from, 'actor2');
        assert.equal(message, 'hello, my name is actor2');
        done();
      });

      actor.onMessage('actor2', 'hi there'); // this message should be ignored
      actor.onMessage('actor2', 'hello, my name is actor2');
    });

  });

  describe ('transport', function () {
    it('should send a message via a transport', function (done) {
      var transport = new LocalTransport();

      var actor1 = new Actor('actor1');
      actor1.connect(transport);
      var actor2 = new Actor('actor2');
      actor2.connect(transport);

      actor1.on('hello', function (from, message) {
        assert.equal(from, 'actor2');
        assert.equal(message, 'hello');
        done();
      });

      actor2.send('actor1', 'hello');
    });

    it('should resolve a promise when connected to a transport', function () {
      var transport = new LocalTransport();
      var actor1 = new Actor('actor1');

      return actor1.connect(transport).then(function (actor) {
        assert.strictEqual(actor, actor1);
      });
    });

    it('should connect to multiple transports', function (done) {
      var transport1 = new LocalTransport();
      var transport2 = new LocalTransport();

      var actor1 = new Actor('actor1');
      var actor2 = new Actor('actor2');
      var actor3 = new Actor('actor3');

      actor1.connect(transport1);
      actor2.connect(transport1);

      actor2.connect(transport2);
      actor3.connect(transport2);

      var count = 0;

      function log(from, message) {
        assert.equal(from, 'actor2');
        assert.equal(message, 'hello');

        count++;
        if (count == 2) {
          done();
        }
      }

      actor1.on('hello', log);
      actor3.on('hello', log);

      // send messages to actors connected via a different transport
      actor2.send('actor1', 'hello');
      actor2.send('actor3', 'hello');
    });
  });

});
