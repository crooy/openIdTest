class Facebook
  constructor: (@app, @conf)->
    @app.get '/facebook/url', (req, res)=> @buildFBurl req, res
    @app.get '/facebook/callback', (req, res) => @authCallback req, res
    @https = require 'https'
    @qs = require 'querystring'
  
  buildFBurl: (req, res)->
    if (req.param('return')) then req.session.return = req.param('return')

    options = 
      client_id : @conf.fb.appId
      redirect_uri : 'http://pagekite.crooy.com/facebook/callback'
      scope: 'email'
      state: req.session.csrfcheck

    req.session.csrfCheck = Math.floor(Math.random()*99999)
    url = 'https://www.facebook.com/dialog/oauth'
    url += '?' + @qs.stringify options
    res.json url

  authCallback: (req, res) ->
    if req.param('state') != req.session.csrfCheck
      console.log 'csrf check failed'
      #res.send 'cross site request forgery suspected', 400
      #return
    
    console.log 'logged in'
    @getToken()
    
    res.redirect req.session.return if req.session.return
    res.redirect '/'
  
  getToken:->
    console.log 'getting token'
    params = 
      client_id : @conf.fb.appId
      redirect_uri : 'http://pagekite.crooy.com/facebook/callback'
      client_secret : @conf.fb.appSecret
    options = 
      host : 'https://graph.facebook.com'
      path : 'oauth/access_token?' + @qs.stringify params
    @https.request options, (res) => 
      console.log 'token request send'
      res.on 'data', @getUser
  
  getUser:(token)=>
    options =
      host : 'https://graph.facebook.com'
      path : 'me?token=' +token 
    @https.request options, (res) => res.on 'data', (d)=> console.log d


exports.setup = (app,conf)->new Facebook(app,conf)
