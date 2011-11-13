var Facebook;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Facebook = (function() {
  __extends(Facebook, Observable);
  function Facebook() {
    this.buildFBOnInit = __bind(this.buildFBOnInit, this);    Facebook.__super__.constructor.call(this);
    window.fbAsyncInit = this.buildFBOnInit;
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
        console.log('logged in');
        return this.notify('FBLoggedin');
      } else {
        console.log('not logged in');
        return this.notify('FBLoginFailed');
      }
    }) : void 0;
  };
  return Facebook;
})();