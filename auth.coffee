openid = require 'openid'

class Auth
  constructor : (@app, @conf) ->
    @openid = openid
    @app.get('/authenticate/:identifier?', (req,res,next)=>@authenticate(req,res,next))
    @app.get('/verify', (req,res,next)=>@verify(req,res,next))

  relyingParty : new openid.RelyingParty(
    'http://crooy.com:3000/verify', # Verification URL (yours)
    null, # Realm (optional, specifies realm for OpenID authentication)
    false, # Use stateless verification
    false, # Strict mode
    @extensions) # List of extensions to enable and include
  verify : (req, res, next) ->
    @relyingParty.verifyAssertion req, (error, result)->
      if (error) 
        res.render 'failed'
      else
        res.render 'loggeding'

  authenticate : (req, res, next) =>
    console.log req.params.identifier
    @relyingParty.authenticate req.params.identifier, false, (error, authUrl) ->
      if(error)
        res.writeHead(200)
        res.end('Authentication failed: ' + error)
      else if (!authUrl)
        res.writeHead(200)
        res.end('Authentication failed')
      else
        res.writeHead(302, { Location: authUrl })
   extensions = [new openid.UserInterface() 
                new openid.SimpleRegistration({
                    "nickname" : true, 
                    "email" : true, 
                    "fullname" : true,
                    "dob" : true, 
                    "gender" : true, 
                    "postcode" : true,
                    "country" : true, 
                    "language" : true, 
                    "timezone" : true
                  })
                new openid.AttributeExchange({
                    "http://axschema.org/contact/email": "required",
                    "http://axschema.org/namePerson/friendly": "required",
                    "http://axschema.org/namePerson": "required"
                  })
  ] 


exports.setup = (app, conf) ->  new Auth(app, conf)
