module.exports = (sequelize, type) => {
  return sequelize.define('password', {
    value: {
      type: type.STRING
    }
  });
};
