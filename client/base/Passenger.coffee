#<< Messagebus

singletonMessageBus = new Messagebus()

class Passenger extends Actor
  constructor:->
    super()
    singletonMessageBus.subscribe @
    @bus = singletonMessageBus
  send:(message)->
    @bus.send(message)
