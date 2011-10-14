express = require('express')
fs = require('fs')
oAuthStuff = require('./oAuthStuff')
myApp = require('./myApp')

#options = {
#  ca:   fs.readFileSync('../sub.class1.server.ca.pem.cer'),
#  key:  fs.readFileSync('../ssl.key'),
#  cert: fs.readFileSync('../ssl.crt')
#}

app = express.createServer()

oAuthStuff.setup(express,app)
myApp.setup(express,app)

app.listen(8080)
