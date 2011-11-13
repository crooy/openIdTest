  doctype 5
  html ->
    head ->
      meta charset: 'utf-8'
      meta('http-equiv': 'X-UA-Compatible', content:'IE=edge,chrome=1')
      title @title or 'Untitled' 
      meta(name: 'description', content: @description) if @description?
      meta(name: 'keywords', content: @keywords) if @keywords?
      meta(name: 'viewport', content: 'width=device-width, initial-scale=1.0')
      link rel: 'stylesheet', href: 'http://twitter.github.com/bootstrap/1.4.0/bootstrap.min.css'

      script src: 'http://code.jquery.com/jquery-1.7.min.js'
      (script src: 'http://html5shim.googlecode.com/svn/trunk/html5.js')  if @isIE?
      script src: 'app.js'
      #script src: 'toaster/src/facebook.js'
      #script src: 'toaster/src/actor.js'
      #script src: 'toaster/src/user.js'
      script @javascript if @javascript? # scripts from express.expose

  body ->
      div id:'content', class:'container'
        @body
