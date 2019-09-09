const db = require('../sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.login    = (req, res, next) => {
  Promise
    .all([])
    .then(([user, hash]) => {});

  db
    .User
    .findOne({
      where: {
        email: req.body.email
      }
    })
    .then(user => db.Password.findOne({
      where: {
        userId: user.id
      }
    }))
    .then(pass => bcrypt.compare(req.body.password, pass.value))
    .then(result => {
      if (result) 
        res.json({success: true, user: user});
      else 
        res.json({success: false, reason: 'invalid pass'});
      }
    )
    .catch(err => res.json(err));
};

module.exports.register = (req, res, next) => {
  let pass = req.body.password;

  if (!pass || pass.length < 6) 
    return res.json({success: false, reason: 'Password length not okay'});
  
  Promise
    .all([
      db
        .User
        .create(req.body),
      bcrypt.hash(pass, saltRounds)
    ])
    .then(([user, hash]) => {
      db
        .Password
        .create({userId: user.id, value: hash});
      res.json(user);
    })
    .catch(err => res.json(err));
};
