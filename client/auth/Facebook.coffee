#<< base/Messagebus

class Facebook extends Passenger
  constructor:()->
    super()
    window.fbAsyncInit = @buildFBOnInit
    @loadFbjs()

  loadFbjs: ()->
    id = "facebook-jssdk"
    return  if document.getElementById(id)
    js = document.createElement("script")
    js.id = id
    js.async = true
    js.src = "//connect.facebook.net/en_US/all.js"
    document.getElementsByTagName("head")[0].appendChild js
    console.log 'going to get FB js'

  buildFBOnInit: ()=>
    FB?.init
      appId: conf.fb.appId
      channelUrl: conf.fb.channelUrl
      status: true
      logging: true
      cookie: true
      oauth: true
      xfbml: true
    @notifyLogin()

  notifyLogin: ()->
    FB?.getLoginStatus (response)->
      if (response.authResponse)
        console.log 'logged in'
        #@notify 'FBLoggedin'
      else
        console.log 'not logged in'
        #@notify 'FBLoginFailed'
