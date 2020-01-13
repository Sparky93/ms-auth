const Sequelize = require("sequelize");
const Database = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASe_PASSWORD, {
    host: process.env.APP_HOST,
    dialect: process.env.DATABASE_DIALECT,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const Password = require("./model/password")(Database, Sequelize);
const User = require("./model/user")(Database, Sequelize);
const Wallet = require("./model/wallet")(Database, Sequelize);
const Ticket = require("./model/ticket")(Database, Sequelize);
const Raffle = require("./model/raffle")(Database, Sequelize);
const Type = require("./model/type")(Database, Sequelize);

User.hasOne(Password);
User.hasOne(Wallet);
User.hasMany(Ticket);

Raffle.hasOne(Ticket);

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
module.exports.Wallet = Wallet;
module.exports.Ticket = Ticket;
module.exports.Raffle = Raffle;
module.exports.Type = Type;
