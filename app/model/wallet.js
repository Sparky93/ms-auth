module.exports = (sequelize, type) => {
  return sequelize.define('wallet', {
    address: {
      type: type.STRING,
      unique: true,
      nonNull: true
    },
    balance: {
      type: type.FLOAT,
      nonNull: true,
      defaultValue: 0
    }
  });
};
