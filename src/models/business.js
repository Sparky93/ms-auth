module.exports = (sequelize, type) => {
  return sequelize.define('business', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    address: {
      type: type.STRING
    },
    rating: {
      type: type.INTEGER
    }
  });
};
