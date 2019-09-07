const models = require('../sequelize');

module.exports.login    = (req, res, next) => {
  models
    .User
    .findByPk(req.body.id)
    .then(user => res.json(user))
    .catch(err => res.json({error: err.errors}));
};

module.exports.register = (req, res, next) => {
  models
    .User
    .create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json({error: err.errors}));
};
