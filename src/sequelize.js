const Sequelize = require('sequelize');
const Database = require('./config/mysql.conf');

const UserModel = require('./models/user');
const PasswordModel = require('./models/password');

const User = UserModel(Database, Sequelize);
const Password = PasswordModel(Database, Sequelize);

User.hasOne(Password);
Password.belongsTo(User);

Database
  .sync({force: true})
  .then(() => {
    console.log(`[Database] Tables successfully created!`);
  }, (err) => {
    console.log(err);
  });

module.exports.User     = User;
module.exports.Password = Password;
