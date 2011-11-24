#<< base/Passenger

class Widget extends Passenger
  constructor:->
  newGuid:->
    S4 = ->
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring 1
    S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()

  create:(elementType="div")->
    t = document.createElement(elementType)
    t.id = @newGuid()
    $(t)
