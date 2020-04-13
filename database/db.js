const Sequelize = require('sequelize')
const db = {}
const sequelize = new Sequelize('heroku_eff46056a22e1a4', 'b4b170e8daceb8', 'ffda00d5', {
  host: 'us-cdbr-iron-east-04.cleardb.net',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db