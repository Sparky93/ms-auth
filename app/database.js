const Sequelize = require("sequelize");
const Database = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASe_PASSWORD,
  {
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

const UserModel = require("./model/user");
const PasswordModel = require("./model/password");

const User = UserModel(Database, Sequelize);
const Password = PasswordModel(Database, Sequelize);

User.hasOne(Password);
Password.belongsTo(User);

Database.sync({ force: true }).then(
  () => {
    console.log(`[Database] Tables successfully created!`);
  },
  err => {
    console.log(err);
  }
);

module.exports.User = User;
module.exports.Password = Password;
