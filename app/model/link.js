module.exports = (sequelize, type) => {
  return sequelize.define('link', {
    value: {
      type: type.STRING,
      nonNull: true,
      defaultValue: ""
    },
    description: {
      type: type.STRING,
      nonNull: true,
      defaultValue: ""
    },
    impression: {
        type: type.INTEGER,
        nonNull: true,
        defaultValue: 0
    }
  });
};
