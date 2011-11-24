class Facebook
  constructor: (@app, @conf)->
    @app.get '/facebook/url', (req, res)=> @buildFBurl req, res
    @app.get '/facebook/callback', (req, res) => @authCallback req, res
    @https = require 'https'
    @qs = require 'querystring'
    @request = require 'request'

  uid:->
    S4 = ->
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring 1
    S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
  
  
  buildFBurl: (req, res)->
    if (req.param('return')) then req.session.return = req.param('return')

    options = 
      client_id : @conf.fb.appId
      redirect_uri : 'http://pagekite.crooy.com/facebook/callback'
      scope: 'email'
      state: req.session.csrfcheck

    req.session.csrfCheck = @uid()
    url = 'https://www.facebook.com/dialog/oauth'
    url += '?' + @qs.stringify options
    res.json url

  authCallback: (req, res) ->
    if req.param('state') != req.session.csrfCheck
      console.log 'csrf check failed'
      #res.send 'cross site request forgery suspected', 400
      #return
    
    console.log 'logged in'
    @getToken req.param 'code'
    
    res.redirect req.session.return if req.session.return
    res.redirect '/'
  
  getToken:(code)=>
    console.log 'getting token'
    params = 
      client_id : @conf.fb.appId
      redirect_uri : 'http://pagekite.crooy.com/facebook/callback'
      client_secret : @conf.fb.appSecret
      code: code

    url = "https://graph.facebook.com/oauth/access_token"
    url += "?" + @qs.stringify params
    @request url, (error, response, body) =>
      console.log 'got access token'
      @getUser body if not error and response.statusCode is 200
  
  getUser:(token)=>
    @request 'https://graph.facebook.com/me?'+token, (error,response, body) ->
      console.log 'got me'
      console.log body  if not error and response.statusCode is 200


