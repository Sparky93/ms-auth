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

const PasswordModel = require("./model/password");
const UserModel = require("./model/user");
const WalletModel = require("./model/wallet");
const TicketModel = require("./model/ticket");
const RaffleModel = require("./model/raffle");

const Password = PasswordModel(Database, Sequelize);
const User = UserModel(Database, Sequelize);
const Wallet = WalletModel(Database, Sequelize);
const Ticket = TicketModel(Database, Sequelize);
const Raffle = RaffleModel(Database, Sequelize);

User.hasOne(Password);
User.hasOne(Wallet);
User.hasMany(Ticket);

Ticket.hasOne(Raffle);

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
