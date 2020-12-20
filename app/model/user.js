module.exports = (sequelize, type) => {
  return sequelize.define('user', {
    nickname: {
      type: type.STRING,
      unique: true,
      nonNull: true
    },
    token: {
      type: type.STRING,
      nonNull: true,
      defaultValue: ""
    }
  });
};
