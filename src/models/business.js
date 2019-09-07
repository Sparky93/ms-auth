module.exports = (sequelize, type) => {
  return sequelize.define('business', {
    address: {
      type: type.STRING
    },
    rating : {
      type: type.INTEGER
    }
  }, {underscored: true});
};
