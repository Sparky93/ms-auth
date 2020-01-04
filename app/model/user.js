module.exports = (sequelize, type) => {
  return sequelize.define('user', {
    identifier: {
      type: type.STRING,
      unique: true,
      nonNull: true
    },
    nickname: {
      type: type.STRING,
      unique: true,
      nonNull: true
    }
  });
};
