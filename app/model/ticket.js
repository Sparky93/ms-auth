module.exports = (sequelize, type) => {
  return sequelize.define('ticket', {
    rafNo: {
      type: type.INTEGER,
      nonNull: true
    }
  });
};
