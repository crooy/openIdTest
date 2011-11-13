#<< Observable

class Messagebus extends Observable
  constructor:->
    super()
  send:(message, recipient = '*' ) -> 
    if recipient == '*'
      @notify(message)
    else
      observer.receive(message, @) for observer in @observers when observer.respondsTo?()
  process:->process
    @send message for message in @inbox
