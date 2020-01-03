module.exports = (sequelize, type) => {
  return sequelize.define("user", {
    identifier: {
      type: type.STRING,
      unique: true,
      nonNull: true
    },
    firstName: type.STRING,
    lastName: type.STRING,
    age: type.INTEGER
  });
};
