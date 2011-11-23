exports.setup = (express,app) ->
  app.configure ()->
    app.use express.static(__dirname + '/../public')

    app.register '.coffee', require('coffeekup')
    app.set 'view engine', 'coffee'

    app.use express.logger()
    app.use express.bodyParser()
    app.use express.cookieParser()
    app.use express.session({secret:'fsdfwer'})

    app.use express.errorHandler({ dumpExceptions: true, showStack: true })

  app.get '/', (req, res) ->
        res.render 'index'

