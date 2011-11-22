class Actor
  inbox : []
  receive:(message, sender)->
    @inbox.push message:message, sender:sender
    @process?()
