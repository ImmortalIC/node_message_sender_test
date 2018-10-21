module.exports = function (sequelize, types) {
  var User = sequelize.define('users', {
    'name': types.STRING,
    'vkID': types.INTEGER
  },
  {
    'indexes': [
      {
        fields: ['name']
      }
    ]
  })
  return User
}
