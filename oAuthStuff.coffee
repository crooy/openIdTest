exports.setup = (express,app) ->

    connect = require('connect')
    auth= require('../lib/index')
    url = require('url')
    fs = require('fs')
    

