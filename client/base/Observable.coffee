#<< base/Actor

class Observable extends Actor
  observers : []
  notify:(message)->
    observer.receive(message, @ ) for observer in @observers
  subscribe:(actor)->
    @observers.push actor if actor.receive?
