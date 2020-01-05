const app = require("express")();
const db = require("../database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const tokenValidator = require("../validator/token");
const fieldValidator = require("../validator/field");

app.post("/api/auth/register",
  fieldValidator.identifier,
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
        db.Wallet.create({
            userId: user.id,
            address: hash
          })
          .then(wallet => {
            tokenValidator.sign(user);
            res.json({
              success: true,
              user,
              wallet
            });
          });
      })
      .catch(err =>
        res.status(412).json({
          success: false,
          message: err.errors ? err.errors[0].message : err
        })
      );
  });

app.post("/api/auth/login",
  fieldValidator.identifier,
  (req, res, next) => {
    db.User.findOne({
        where: {
          identifier: req.body.identifier
        }
      })
      .then(user => {
        if (!user) return res.json({
          success: false,
          message: "user not found"
        });

        res.locals.user = user;

        return Promise.all([
          db.Password.findOne({
            where: {
              userId: user.id
            }
          }),
          db.Wallet.findOne({
            where: {
              userId: user.id
            }
          })
        ]);
      })
      .then(([password, wallet]) => {
        res.locals.wallet = wallet;
        return bcrypt.compare(req.body.password, password.value);
      })
      .then(result => {
        if (!result) return res.json({
          success: false,
          message: "invalid password"
        });

        tokenValidator.sign(res.locals.user);
        res.json({
          success: true,
          user: res.locals.user,
          wallet: res.locals.wallet
        });
      })
      .catch(err => {
        res.status(err.status == undefined ? 500 : err.status).json(err);
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
          message: rows > 0 ? "User successfully updated" : "Nothing changed"
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
