express = require 'express'
routing = require './routing' 
auth = require './auth'
conf = require './conf' 

app = express.createServer()

routing.setup express, app 
auth.setup  app, conf

app.listen 3000 
