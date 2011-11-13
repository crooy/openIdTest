(function() {
  var Actor, Facebook, Messagebus, Observable;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Actor = (function() {
    function Actor() {}
    Actor.prototype.inbox = [];
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
    __extends(Observable, Actor);
    function Observable() {
      Observable.__super__.constructor.apply(this, arguments);
    }
    Observable.prototype.observers = [];
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
    return Observable;
  })();
  Messagebus = (function() {
    __extends(Messagebus, Observable);
    function Messagebus() {
      Messagebus.__super__.constructor.call(this);
    }
    Messagebus.prototype.send = function(message, type) {
      var _ref;
      if (type == null) {
        type = 'broadcast';
      }
            if ((_ref = message.type) != null) {
        _ref;
      } else {
        message.type = type;
      };
      return this.notify(message);
    };
    Messagebus.prototype.process = function() {
      var message, _i, _len, _ref, _results;
      _ref = this.inbox;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        message = _ref[_i];
        if (message.type === 'broadcast') {
          _results.push(this.send(message));
        }
      }
      return _results;
    };
    return Messagebus;
  })();
  Facebook = (function() {
    function Facebook() {
      this.buildFBOnInit = __bind(this.buildFBOnInit, this);      window.fbAsyncInit = this.buildFBOnInit;
      this.loadFbjs();
    }
    Facebook.prototype.loadFbjs = function() {
      var id, js;
      id = "facebook-jssdk";
      if (document.getElementById(id)) {
        return;
      }
      js = document.createElement("script");
      js.id = id;
      js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";
      document.getElementsByTagName("head")[0].appendChild(js);
      return console.log('going to get FB js');
    };
    Facebook.prototype.buildFBOnInit = function() {
      if (typeof FB !== "undefined" && FB !== null) {
        FB.init({
          appId: conf.fb.appId,
          channelUrl: conf.fb.channelUrl,
          status: true,
          logging: true,
          cookie: true,
          oauth: true,
          xfbml: true
        });
      }
      return this.notifyLogin();
    };
    Facebook.prototype.notifyLogin = function() {
      return typeof FB !== "undefined" && FB !== null ? FB.getLoginStatus(function(response) {
        if (response.authResponse) {
          return console.log('logged in');
        } else {
          return console.log('not logged in');
        }
      }) : void 0;
    };
    return Facebook;
  })();
  console.log('test');
}).call(this);
