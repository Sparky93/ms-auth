const app = require("express")();
const db = require("../database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const tokenValidator = require("../validator/token");
const fieldValidator = require("../validator/field");

app.post("/api/auth/register",
  fieldValidator.nickname,
  fieldValidator.password,
  (req, res, next) => {
    Promise
      .all([db.User.create(req.body), bcrypt.hash(req.body.password, saltRounds)])
      .then(([user, hash]) => {
        db.Password.create({
          userId: user.id,
          value: hash
        });
        //tokenValidator.sign(user);
        res.json({ success: true, user });
      })
      .catch(err =>
        res.status(412).json({
          success: false,
          message: err.errors ? err.errors[0].message : err
        })
      );
  });

app.post("/api/auth/login",
  fieldValidator.nickname,
  (req, res, next) => {
    db.User.findOne({
      where: {
        nickname: req.body.nickname
      }
    }).then(user => {
      tokenValidator.sign(user);
      return Promise.resolve(user);
    }).then(user => {
      res.locals.user = user;
      return db.User.update({ token: user.token }, { where: { id: user.id } })
    }).then(result => {
      console.log(`Updated ${result} row(s) with token!`)
      return db.Password.findOne({
        where: {
          userId: res.locals.user.id
        }
      });
    }).then(password => {
      return bcrypt.compare(req.body.password, password.value);
    }).then(result => {
      if (!result) return res.json({
        success: false,
        message: "invalid password"
      });
      res.json({
        success: true,
        user: res.locals.user
      });
    }).catch(err => {
      res.status(err.status == undefined ? 500 : err.status).json({ success: false, message: err });
    });
  });

app.put("/api/auth/update",
  tokenValidator.validate,
  (req, res, next) => {
    db.User.update(req.body, {
      returning: true,
      where: {
        id: res.locals.id
      }
    })
      .then(([results, rows]) => {
        res.json({
          success: rows > 0,
          message: rows > 0 ? "User successfully updated" : "Nothing changed",
          user: rows > 0 ? results : null
        });
      })
      .catch(err => {
        res.status(401).json({
          success: false,
          message: err
        });
      });
  });

module.exports = app;
