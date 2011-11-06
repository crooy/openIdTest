  h1 'oAuth Test' 

  div id:'fb-root'
  div class:'fb-login-button',style:'display:none'

  coffeescript -> 
    window.fbAsyncInit = ->
      console.log 'going to init FB, with appid '+appId.appId
      FB.init
        appId: appId.appId
        channelURL: "http://pagekite.crooy.com/channel.html"
        status: true
        logging: true
        cookie: true
        oauth: true
        xfbml: true

      determineLoggedIn()

    loadFb = (d) ->
      id = "facebook-jssdk"
      return  if d.getElementById(id)
      js = d.createElement("script")
      js.id = id
      js.async = true
      js.src = "//connect.facebook.net/en_US/all.js"
      d.getElementsByTagName("head")[0].appendChild js
      console.log 'going to get FB js'
  
    loadFb document

    fbLogin = (response) ->
        if response.authResponse
          console.log "Welcome!  Fetching your information.... "
          FB.api "/me", (response) ->
            console.log "Good to see you, " + response.name + "."
            console.log response
        else
          console.log "User cancelled login or did not fully authorize."

    $('#email').click ()-> FB.login(fbLogin, scope: "email") if FB? 

    determineLoggedIn=()->
      if FB? 
        FB.getLoginStatus (response)->
          if (response.authResponse) 
            console.log 'logged in and connected user, someone you know'
            $('.fb-login-button').hide()
          else 
            console.log 'no user session available, someone you dont know'
            $('.fb-login-button').show()

        
