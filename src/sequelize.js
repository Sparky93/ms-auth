const Sequelize = require('sequelize');
const UserModel = require('./models/user');
const BusinessModel = require('./models/business');
const Database = require('./config/mysql.conf');

const User = UserModel(Database, Sequelize);
const Business = BusinessModel(Database, Sequelize);
const UserBusiness = Database.define('user_business', {});

Business.belongsToMany(User, {
  through: UserBusiness,
  unique: false
});
User.belongsTo(Business);

Database.sync({
  force: true
}).then(() => {
  console.log('Tables successfully created!');
}, (err) => {
  console.log(err);
});

exports.User = User;
exports.Business = Business;
