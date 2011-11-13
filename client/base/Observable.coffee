#<< Actor

class Observable extends Actor
  observers : []
  notify:(message)->
    observer.receive(message, @ ) for observer in @observers
  subscribe:(actor)->
    if actor.receive?
      @observers.push actor
