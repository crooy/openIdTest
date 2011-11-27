#<<  Routes, Config, base/*, auth/*
express = require 'express'

app = express.createServer()

new Routes express, app 
new Facebook app, new Config()

app.listen 3000 
