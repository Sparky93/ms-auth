module.exports = (sequelize, type) => {
  return sequelize.define('raffle', {
    typeId: {
      type: type.INTEGER,
      nonNull: true,
      defaultValue: 0
    }
  });
};
