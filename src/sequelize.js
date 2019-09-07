const Sequelize = require('sequelize');
const Database = require('./config/mysql.conf');

const UserModel = require('./models/user');
const PasswordModel = require('./models/password');
const BusinessModel = require('./models/business');

const User = UserModel(Database, Sequelize);
const Password = PasswordModel(Database, Sequelize);
const Business = BusinessModel(Database, Sequelize);
const UserBusiness = Database.define('user_businesses', {});

Business.belongsToMany(User, {through: UserBusiness});
Password.belongsTo(User);

Database
  .sync({force: true})
  .then(() => {
    console.log('Tables successfully created!');
  }, (err) => {
    console.log(err);
  });

module.exports.User     = User;
module.exports.Business = Business;
module.exports.Password = Password;
