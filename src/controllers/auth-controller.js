const db = require('../sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.login = (req, res, next) => {
  db.User.findOne({
    where: {
      email: req.query.email
    }
  }).then(user => {
    if (!user) 
      throw {
        success : false,
        reason: 'user not found',
        status: 404
      };
    return db.Password.findOne({userId: user.id});
  }).then(pass => bcrypt.compare(req.query.password, pass.value)).then(result => {
    if (result) 
      res.json({success: true});
    else 
      throw {
        success : false,
        reason: 'invalid password',
        status: 401
      };
  }).catch(err => res.status(
    err.status == undefined
    ? 500
    : err.status).json(err));
};

module.exports.register = (req, res, next) => {
  let pass = req.body.password;

  if (!pass || pass.length < 6) 
    return res.status(412).json({success: false, reason: 'Password length not okay', status: 412});
  
  Promise.all([
    db.User.create(req.body),
    bcrypt.hash(pass, saltRounds)
  ]).then(([user, hash]) => {
    db.Password.create({userId: user.id, value: hash});
    res.json(user);
  }).catch(err => res.status(412).json({success: false, reason: err.errors[0].message, status: 412}));
}
