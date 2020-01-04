module.exports = (sequelize, type) => {
  return sequelize.define('raffle', {
    number: type.INTEGER
  });
};
