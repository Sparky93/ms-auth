module.exports = (sequelize, type) => {
  return sequelize.define('type', {
    name: {
      type: type.STRING,
      nonNull: true,
      defaultValue: ""
    },
    description: {
      type: type.STRING,
      nonNull: true,
      defaultValue: ""
    },
    price: {
        type: type.FLOAT,
        nonNull: true,
        defaultValue: 0
    }
  });
};
