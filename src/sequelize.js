const Sequelize = require('sequelize');
const Database = require('./config/mysql.conf');
const UserModel = require('./models/user');
const PasswordModel = require('./models/password');
const BusinessModel = require('./models/business');
const User = UserModel(Database, Sequelize);
const Business = BusinessModel(Database, Sequelize);
const UserBusiness = Database.define('user_business', {});

Business.belongsToMany(User, {
  through: UserBusiness,
  unique : false
});
User.belongsTo(Business);

Database.sync({force: true}).then(() => {
  console.log('Tables successfully created!');
}, (err) => {
  console.log(err);
});

exports.User     = User;
exports.Business = Business;
