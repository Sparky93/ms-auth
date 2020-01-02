const app = require('express')();
const db = require('../database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

app.post('/api/auth/register', (req, res, next) => {
  let pass = req.body.password;

  if (!pass || pass.length < process.env.PASSWORD_STRENGTH) {
    return res
      .status(412)
      .json({success: false, reason: 'Password length not okay'});
  }

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
      let token = jwt.sign({
        id   : user.id,
        email: user.email
      }, process.env.APP_SECRET_KEY, {expiresIn: process.env.APP_TOKEN_LIFETIME});
      res.json({success: true, user, token});
    })
    .catch(err => res.status(412).json({success: false, reason: err}));
});

app.get('/api/auth/login', (req, res, next) => {
  let validUser = null;

  db
    .User
    .findOne({
      where: {
        email: req.query.email
      }
    })
    .then(user => {
      if (!user)
        throw {
          success : false,
          reason: 'user not found',
          status: 404
        };
      validUser = user;
      return db
        .Password
        .findOne({
          where: {
            userId: user.id
          }
        });
    })
    .then(pass => {
      return bcrypt.compare(req.query.password, pass.value);
    })
    .then(result => {
      if (result) {
        const token = jwt.sign({
          id   : validUser.id,
          email: validUser.email
        }, process.env.APP_SECRET_KEY, {expiresIn: process.env.APP_TOKEN_LIFETIME});
        res.json({success: true, user: validUser, token: token});
      } else
        throw {
          success : false,
          reason: 'invalid password',
          status: 401
        };
    })
    .catch(err => res.status(
      err.status == undefined
      ? 500
      : err.status).json(err));
});

app.delete('/api/auth/remove', (req, res, next) => {
  res.json({success: true, message: "User successfully removed!"});
  next();
});

module.exports = app;
