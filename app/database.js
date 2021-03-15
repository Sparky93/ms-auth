const Sequelize = require("sequelize");
const Database = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD, {
  host: process.env.APP_HOST,
  dialect: process.env.DATABASE_DIALECT,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const Password = require("./model/password")(Database, Sequelize);
const User = require("./model/user")(Database, Sequelize);
const Link = require("./model/link")(Database, Sequelize);

User.hasOne(Password);
User.hasMany(Link);

Database.sync({
  force: true
}).then(
  () => {
    console.log(`[Database] Tables successfully created!`);
  },
  err => {
    console.log(err);
  }
);

module.exports.Password = Password;
module.exports.User = User;
module.exports.Link = Link