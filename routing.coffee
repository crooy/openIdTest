exports.setup = (express,app) ->
  app.register '.coffee', require('coffeekup')
  app.set 'view engine', 'coffee'
  app.use express.static(__dirname + '/public')
  app.use express.logger()
  #app.use express.bodyParser()
  #app.use express.cookieParser()
  #app.use express.session({secret:'fsdfwer'})
  app.get '/', (req, res) ->
      res.render 'index', javascript:app.exposed()

