#<< base/Any

class Facebook extends Any
  constructor: (@app, @conf)->
    super()
    @app.get '/facebook/url', (req, res)=> @returnFBUrl req, res
    @app.get '/facebook/callback', (req, res) => @authCallback req, res
    @debugMessages = true

  
  returnFBUrl: (req, res)=>
    if (req.param('return')) then req.session.return = req.param('return')

    nonse = @uid()
    req.session.csrfCheck = nonse
    options = 
      client_id : @conf.fb.appId
      redirect_uri : 'http://pagekite.crooy.com/facebook/callback'
      scope: 'email'
      state: nonse

    url = @buildGetUrl 'https://www.facebook.com/dialog/oauth', options
    res.json url


  authCallback: (req, res) =>
    if req.param('state') != req.session.csrfCheck
      @error res, 'cross site request forgery suspected'
      return
    
    @getToken req.param 'code'
    
    res.redirect req.session.return if req.session.return
    res.redirect '/'
  

  getToken:(code)=>
    @debug 'getting facebook token'
    params = 
      client_id : @conf.fb.appId
      redirect_uri : 'http://pagekite.crooy.com/facebook/callback'
      client_secret : @conf.fb.appSecret
      code: code

    url = @buildGetUrl 'https://graph.facebook.com/oauth/access_token', params

    @request url, (error, response, body) =>
      @debug 'got facebook access token'
      @getUser body if not error and response.statusCode is 200
  

  getUser:(token)=>
    @debug 'getting facebook/me'
    @request 'https://graph.facebook.com/me?'+token, (error,response, body) =>
      @debug JSON.parse body  if not error and response.statusCode is 200


