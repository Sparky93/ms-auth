module.exports = (sequelize, type) => {
  return sequelize.define('user', {
    email    : {
      type   : type.STRING,
      unique : true,
      nonNull: true
    },
    firstName: type.STRING,
    lastName : type.STRING,
    age      : type.INTEGER
  }, {underscored: true});
};
