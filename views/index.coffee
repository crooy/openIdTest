  h1 'oAuth Test' 

  div id:'fb-root'
  div class:'fb-login-button', style:'display:none'

  coffeescript -> 
    whoami:()->
      console.log "Welcome!  Fetching your information.... "
      FB.api "/me", (response) ->
        console.log "Good to see you, " + response.name + "."
        console.log response


        
