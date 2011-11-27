class Any
    constructor:->
      @qs = require 'querystring'
      @request = require 'request'
      @debugMessages = false

    uid:->
      S4 = ->
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring 1
      S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
 
    buildGetUrl:(url, params)->
      if (url.lastIndexOf '?' > 0) 
        delim = '&'
      else
        delim = '?'
      @debug 'build url '+url+delim+@qs.stringify params
      url + delim + @qs.stringify(params)

    dumpObjectIndented : (obj, indent = '') ->
      if typeof obj is "string" then return obj

      result = ""
      for property of obj
        value = obj[property]
        if typeof value is "string"
          value = "'" + value + "'"
        else if typeof value is "object"
          if value instanceof Array
            value = "[ " + value + " ]"
          else
            od = @dumpObjectIndented(value, indent + "  ")
            value = "\n" + indent + "{\n" + od + "\n" + indent + "}"
        result += indent + "'" + property + "' : " + value + ",\n"
      result.replace /,\n$/, ""

    error:(res, mesg, code = 400)->
      console.log 'ERROR '+code+' ['+mesg+']'
      res.send mesg, code 
    
    debug:(mesg)->
      console.log('DEBUG ['+ @dumpObjectIndented(mesg)+']') if @debugMessages


    info:(mesg)->
      console.log 'INFO ['+mesg+']'
