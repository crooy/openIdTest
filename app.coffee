express = require 'express'
expose = require 'express-expose'
routing = require './server/routing' 
auth = require './server/auth'
conf = require './conf' 
app = express.createServer()


routing.setup express, app 
auth.setup  app, conf

app.expose conf, 'conf'

app.listen 3000 
