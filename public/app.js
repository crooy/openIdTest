
(function() {
  var Actor, Facebook, FacebookButton, Messagebus, Observable, Passenger, Widget, singletonMessageBus;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Actor = (function() {

    function Actor() {}

    Actor.prototype.inbox = [];

    Actor.prototype.receive = function(message, sender) {
      this.inbox.push({
        message: message,
        sender: sender
      });
      return typeof this.process === "function" ? this.process() : void 0;
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
      if (actor.receive != null) return this.observers.push(actor);
    };

    return Observable;

  })();

  Messagebus = (function() {

    __extends(Messagebus, Observable);

    function Messagebus() {
      Messagebus.__super__.constructor.call(this);
    }

    Messagebus.prototype.send = function(message, recipient) {
      var observer, _i, _len, _ref, _results;
      if (recipient == null) recipient = '*';
      if (recipient === '*') {
        return this.notify(message);
      } else {
        _ref = this.observers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          observer = _ref[_i];
          if (typeof observer.respondsTo === "function" ? observer.respondsTo() : void 0) {
            _results.push(observer.receive(message, this));
          }
        }
        return _results;
      }
    };

    Messagebus.prototype.process = function() {
      var message, _i, _len, _ref, _results;
      _ref = this.inbox;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        message = _ref[_i];
        _results.push(this.send(message));
      }
      return _results;
    };

    return Messagebus;

  })();

  singletonMessageBus = new Messagebus();

  Passenger = (function() {

    __extends(Passenger, Actor);

    function Passenger() {
      Passenger.__super__.constructor.call(this);
      singletonMessageBus.subscribe(this);
      this.bus = singletonMessageBus;
    }

    Passenger.prototype.send = function(message) {
      return this.bus.send(message);
    };

    return Passenger;

  })();

  Widget = (function() {

    __extends(Widget, Passenger);

    function Widget() {}

    Widget.prototype.newGuid = function() {
      var S4;
      S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    };

    Widget.prototype.create = function(elementType) {
      var t;
      if (elementType == null) elementType = "div";
      t = document.createElement(elementType);
      t.id = this.newGuid();
      return $(t);
    };

    return Widget;

  })();

  FacebookButton = (function() {

    __extends(FacebookButton, Widget);

    function FacebookButton(id) {
      this.buildButton = __bind(this.buildButton, this);      this.getUrl(id);
    }

    FacebookButton.prototype.getUrl = function(id) {
      var callback;
      var _this = this;
      callback = function(url) {
        return _this.buildButton(id, url);
      };
      return jQuery.getJSON('/facebook/url', {}, function(data, textStatus, jqXHR) {
        return callback(data);
      });
    };

    FacebookButton.prototype.buildButton = function(id, url) {
      var parent;
      this.button = this.create('a');
      this.button.attr('href', url);
      this.button.text("facebook login");
      parent = id != null ? id : document;
      console.log($(parent));
      return $(parent).append(this.button);
    };

    return FacebookButton;

  })();

  Facebook = (function() {

    __extends(Facebook, Passenger);

    function Facebook() {
      this.buildFBOnInit = __bind(this.buildFBOnInit, this);      Facebook.__super__.constructor.call(this);
      window.fbAsyncInit = this.buildFBOnInit;
      this.loadFbjs();
    }

    Facebook.prototype.loadFbjs = function() {
      var id, js;
      id = "facebook-jssdk";
      if (document.getElementById(id)) return;
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

  $(document).ready(function() {
    var face;
    return face = new FacebookButton('#content');
  });

}).call(this);
