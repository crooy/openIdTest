
(function() {
  var Auth, Config, Facebook, Routes, app, express, openid;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Facebook = (function() {

    function Facebook(app, conf) {
      var _this = this;
      this.app = app;
      this.conf = conf;
      this.getUser = __bind(this.getUser, this);
      this.getToken = __bind(this.getToken, this);
      this.app.get('/facebook/url', function(req, res) {
        return _this.buildFBurl(req, res);
      });
      this.app.get('/facebook/callback', function(req, res) {
        return _this.authCallback(req, res);
      });
      this.https = require('https');
      this.qs = require('querystring');
      this.request = require('request');
    }

    Facebook.prototype.uid = function() {
      var S4;
      S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    };

    Facebook.prototype.buildFBurl = function(req, res) {
      var options, url;
      if (req.param('return')) req.session["return"] = req.param('return');
      options = {
        client_id: this.conf.fb.appId,
        redirect_uri: 'http://pagekite.crooy.com/facebook/callback',
        scope: 'email',
        state: req.session.csrfcheck
      };
      req.session.csrfCheck = this.uid();
      url = 'https://www.facebook.com/dialog/oauth';
      url += '?' + this.qs.stringify(options);
      return res.json(url);
    };

    Facebook.prototype.authCallback = function(req, res) {
      if (req.param('state') !== req.session.csrfCheck) {
        console.log('csrf check failed');
      }
      console.log('logged in');
      this.getToken(req.param('code'));
      if (req.session["return"]) res.redirect(req.session["return"]);
      return res.redirect('/');
    };

    Facebook.prototype.getToken = function(code) {
      var params, url;
      var _this = this;
      console.log('getting token');
      params = {
        client_id: this.conf.fb.appId,
        redirect_uri: 'http://pagekite.crooy.com/facebook/callback',
        client_secret: this.conf.fb.appSecret,
        code: code
      };
      url = "https://graph.facebook.com/oauth/access_token";
      url += "?" + this.qs.stringify(params);
      return this.request(url, function(error, response, body) {
        console.log('got access token');
        if (!error && response.statusCode === 200) return _this.getUser(body);
      });
    };

    Facebook.prototype.getUser = function(token) {
      return this.request('https://graph.facebook.com/me?' + token, function(error, response, body) {
        console.log('got me');
        if (!error && response.statusCode === 200) return console.log(body);
      });
    };

    return Facebook;

  })();

  openid = require('openid');

  Auth = (function() {
    var extensions;

    function Auth(app, conf, openid) {
      var _this = this;
      this.app = app;
      this.conf = conf;
      this.openid = openid;
      this.authenticate = __bind(this.authenticate, this);
      app.get('/authenticate/:identifier?', function(req, res) {
        return _this.authenticate(req, res);
      });
      app.get('/verify', function(req, res) {
        return _this.verify(req, res);
      });
      app.get('/channel.htm*', function(req, res) {
        var cache_expire;
        cache_expire = 60 * 60 * 24 * 365;
        res.header("Pragma: public");
        res.header("Cache-Control: max-age=" + cache_expire);
        return res.send('<script src="//connect.facebook.net/en_US/all.js"></script>');
      });
    }

    Auth.prototype.relyingParty = new openid.RelyingParty('http://pagekite.crooy.com/verify', null, false, false, Auth.extensions);

    Auth.prototype.verify = function(req, res) {
      return this.relyingParty.verifyAssertion(req, function(error, result) {
        if (error) {
          return res.render('failed');
        } else {
          return res.render('loggeding');
        }
      });
    };

    Auth.prototype.authenticate = function(req, res) {
      console.log(req.params.identifier);
      return this.relyingParty.authenticate(req.params.identifier, false, function(error, authUrl) {
        if (error) {
          res.writeHead(200);
          return res.end('Authentication failed: ' + error);
        } else if (!authUrl) {
          res.writeHead(200);
          return res.end('Authentication failed');
        } else {
          return res.writeHead(302, {
            Location: authUrl
          });
        }
      });
    };

    extensions = [
      new openid.UserInterface(), new openid.SimpleRegistration({
        "nickname": true,
        "email": true,
        "fullname": true,
        "dob": true,
        "gender": true,
        "postcode": true,
        "country": true,
        "language": true,
        "timezone": true
      }), new openid.AttributeExchange({
        "http://axschema.org/contact/email": "required",
        "http://axschema.org/namePerson/friendly": "required",
        "http://axschema.org/namePerson": "required"
      })
    ];

    return Auth;

  })();

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

    Config.prototype.fb = {
      appId: '182165808529559',
      appSecret: '073f6ac229fbb304573b9af923e12c63',
      channelUrl: 'http://pagekite.crooy.com/channel.html'
    };

    return Config;

  })();

  express = require('express');

  app = express.createServer();

  new Routes(express, app);

  new Facebook(app, new Config());

  app.listen(3000);

}).call(this);
