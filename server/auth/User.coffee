#<< base/Any

class User extends Any
  constructor:(@conf)->
    super()
    @usersByEmail = @conf.database.url + '/_design/users/byEmail'

  getUserByEmail:(email, callback)->
    @request @usersByEmail + "?key=" + email, callback
 
  createUser:(doc, callback)->
    params=
      url: @conf.database.url
      json:doc
    @request.post params, callback
  
