  doctype 5
  html ->
    head ->
      meta charset: 'utf-8'
      meta('http-equiv': 'X-UA-Compatible', content:'IE=edge,chrome=1')
       
      title "#{@title or 'Untitled'}" 
        
      meta(name: 'description', content: @description) if @description?       
      meta(name: 'keywords', content: @keywords) if @keywords?       
      meta(name: 'viewport', content: 'width=device-width, initial-scale=1.0')
        
      link rel: 'stylesheet', href: '/assets/css/main.css?version=1'

      script src: '/assets/js/respond.min.js'
      script src: '/assets/js/jquery.min.js'
      (script src: 'http://html5shim.googlecode.com/svn/trunk/html5.js')  if @isIE?

  body ->
    div id: 'content', ->
        @body
