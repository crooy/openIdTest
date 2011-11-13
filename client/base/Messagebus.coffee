#<< Observable

class Messagebus extends Observable
  constructor:->
    super()
  send:(message, type = 'broadcast' ) -> 
    message.type ?= type
    @notify(message)
  process:->
    @send message for message in @inbox when message.type=='broadcast'
  
