
(function() {
  var Any, Config, Facebook, Routes, User, app, express;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Routes = (function() {

    function Routes(express, app) {
      app.configure(function() {
        app.use(express.static(__dirname + '/public'));
        app.register('.coffee', require('coffeekup'));
        app.set('view engine', 'coffee');
        app.use(express.logger());
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(express.session({
          secret: 'fsdfwer'
        }));
        return app.use(express.errorHandler({
          dumpExceptions: true,
          showStack: true
        }));
      });
      app.get('/', function(req, res) {
        return res.render('index');
      });
    }

    return Routes;

  })();

  Config = (function() {

    function Config() {}

    Config.prototype.database = {
      url: 'http://localhost:5984/template'
    };

    Config.prototype.fb = {
      appId: '182165808529559',
      appSecret: '073f6ac229fbb304573b9af923e12c63',
      channelUrl: 'http://pagekite.crooy.com/channel.html'
    };

    return Config;

  })();

  Any = (function() {

    function Any() {
      this.qs = require('querystring');
      this.request = require('request');
      this.debugMessages = false;
    }

    Any.prototype.uid = function() {
      var S4;
      S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    };

    Any.prototype.buildGetUrl = function(url, params) {
      var delim;
      if (url.lastIndexOf('?' > 0)) {
        delim = '&';
      } else {
        delim = '?';
      }
      this.debug('build url ' + url + delim + this.qs.stringify(params));
      return url + delim + this.qs.stringify(params);
    };

    Any.prototype.dumpObjectIndented = function(obj, indent) {
      var od, property, result, value;
      if (indent == null) indent = '';
      if (typeof obj === "string") return obj;
      result = "";
      for (property in obj) {
        value = obj[property];
        if (typeof value === "string") {
          value = "'" + value + "'";
        } else if (typeof value === "object") {
          if (value instanceof Array) {
            value = "[ " + value + " ]";
          } else {
            od = this.dumpObjectIndented(value, indent + "  ");
            value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
          }
        }
        result += indent + "'" + property + "' : " + value + ",\n";
      }
      return result.replace(/,\n$/, "");
    };

    Any.prototype.error = function(res, mesg, code) {
      if (code == null) code = 400;
      console.log('ERROR ' + code + ' [' + mesg + ']');
      return res.send(mesg, code);
    };

    Any.prototype.debug = function(mesg) {
      if (this.debugMessages) {
        return console.log('DEBUG [' + this.dumpObjectIndented(mesg) + ']');
      }
    };

    Any.prototype.info = function(mesg) {
      return console.log('INFO [' + mesg + ']');
    };

    return Any;

  })();

  Facebook = (function() {

    __extends(Facebook, Any);

    function Facebook(app, conf) {
      var _this = this;
      this.app = app;
      this.conf = conf;
      this.getUser = __bind(this.getUser, this);
      this.getToken = __bind(this.getToken, this);
      this.authCallback = __bind(this.authCallback, this);
      this.returnFBUrl = __bind(this.returnFBUrl, this);
      Facebook.__super__.constructor.call(this);
      this.app.get('/facebook/url', function(req, res) {
        return _this.returnFBUrl(req, res);
      });
      this.app.get('/facebook/callback', function(req, res) {
        return _this.authCallback(req, res);
      });
      this.debugMessages = true;
    }

    Facebook.prototype.returnFBUrl = function(req, res) {
      var nonse, options, url;
      if (req.param('return')) req.session["return"] = req.param('return');
      nonse = this.uid();
      req.session.csrfCheck = nonse;
      options = {
        client_id: this.conf.fb.appId,
        redirect_uri: 'http://pagekite.crooy.com/facebook/callback',
        scope: 'email',
        state: nonse
      };
      url = this.buildGetUrl('https://www.facebook.com/dialog/oauth', options);
      return res.json(url);
    };

    Facebook.prototype.authCallback = function(req, res) {
      if (req.param('state') !== req.session.csrfCheck) {
        this.error(res, 'cross site request forgery suspected');
        return;
      }
      this.getToken(req.param('code'));
      if (req.session["return"]) res.redirect(req.session["return"]);
      return res.redirect('/');
    };

    Facebook.prototype.getToken = function(code) {
      var params, url;
      var _this = this;
      this.debug('getting facebook token');
      params = {
        client_id: this.conf.fb.appId,
        redirect_uri: 'http://pagekite.crooy.com/facebook/callback',
        client_secret: this.conf.fb.appSecret,
        code: code
      };
      url = this.buildGetUrl('https://graph.facebook.com/oauth/access_token', params);
      return this.request(url, function(error, response, body) {
        _this.debug('got facebook access token');
        if (!error && response.statusCode === 200) return _this.getUser(body);
      });
    };

    Facebook.prototype.getUser = function(token) {
      var _this = this;
      this.debug('getting facebook/me');
      return this.request('https://graph.facebook.com/me?' + token, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          return _this.debug(JSON.parse(body));
        }
      });
    };

    return Facebook;

  })();

  User = (function() {

    __extends(User, Any);

    function User(conf) {
      this.conf = conf;
      User.__super__.constructor.call(this);
      this.usersByEmail = this.conf.database.url + '/_design/users/byEmail';
    }

    User.prototype.getUserByEmail = function(email, callback) {
      return this.request(this.usersByEmail + "?key=" + email, callback);
    };

    User.prototype.createUser = function(doc, callback) {
      var params;
      params = {
        url: this.conf.database.url,
        json: doc
      };
      return this.request.post(params, callback);
    };

    return User;

  })();

  express = require('express');

  app = express.createServer();

  new Routes(express, app);

  new Facebook(app, new Config());

  app.listen(3000);

}).call(this);
