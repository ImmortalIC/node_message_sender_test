
var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var basename = path.basename(__filename)
var config = require('../config/config.js')
var db = {}
var sequelize = new Sequelize(config.db.database, config.db.login, config.db.password, {
  'dialect': 'mysql',
  'host': config.db.host,
  'post': config.db.port
})
const modelsDir = path.join(__dirname, 'models')
fs.readdirSync(modelsDir)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(modelsDir, file))
    const name = model.name.substr(0, 1).toUpperCase() + model.name.slice(1, -1)
    db[name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
