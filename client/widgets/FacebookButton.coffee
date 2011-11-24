#<< widgets/Widget

class FacebookButton extends Widget
  constructor:(id)->
    @getUrl(id)

  getUrl:(id)->
    callback = (url)=>@buildButton(id,url)
    jQuery.getJSON '/facebook/url', 
        {},
        (data, textStatus, jqXHR)->
          callback data

  buildButton:(id, url)=>
    @button = @create 'a' 
    @button.attr 'href', url
    @button.text "facebook login"
    parent = id ? document
    console.log $(parent)
    $(parent).append @button 
