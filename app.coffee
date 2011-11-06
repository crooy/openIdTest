express = require 'express'
expose = require 'express-expose'
routing = require './routing' 
auth = require './auth'
conf = require './conf' 
app = express.createServer()

app.expose appId:conf.fb.appId, 'appId'

routing.setup express, app 
auth.setup  app, conf

app.listen 3000 
