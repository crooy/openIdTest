var Actor, Observable;
Actor = (function() {
  function Actor() {
    this.inbox = [];
  }
  Actor.prototype.receive = function(message, sender) {
    this.inbox.push({
      message: message,
      sender: sender
    });
    if (this.process != null) {
      return this.process();
    }
  };
  return Actor;
})();
Observable = (function() {
  function Observable() {
    this.observers = [];
    this.inbox = [];
  }
  Observable.prototype.notify = function(message) {
    var observer, _i, _len, _ref, _results;
    _ref = this.observers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      observer = _ref[_i];
      _results.push(observer.receive(message, this));
    }
    return _results;
  };
  Observable.prototype.subscribe = function(actor) {
    if (actor.receive != null) {
      return this.observers.push(actor);
    }
  };
  Observable.prototype.receive = function(message, sender) {
    this.inbox.push({
      message: message,
      sender: sender
    });
    if (this.process != null) {
      return this.process();
    }
  };
  return Observable;
})();