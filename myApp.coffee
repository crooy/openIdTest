exports.setup = (express,app) ->

    # Setup Template Engine
  app.register '.coffee', require('coffeekup')
  app.set 'view engine', 'coffee'

  # Setup Static Files
  app.use express.static(__dirname + '/public')

  # Setup post body parsing
  app.use express.bodyParser()

  # App Routes
  app.get '/', (req, res) ->
      res.render 'index'

