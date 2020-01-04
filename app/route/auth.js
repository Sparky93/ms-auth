const app = require("express")();
const db = require("../database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const passport = require("passport");

app.post("/api/auth/register", (req, res, next) => {
  const pass = req.body.password;
  const identifier = req.body.identifier;
  const nickname = req.body.nickname;

  if (!identifier) {
    return res.status(412).json({
      success: false,
      reason: "identifier can't be empty"
    });
  }

  if (!nickname) {
    return res.status(412).json({
      success: false,
      reason: "nickname can't be empty"
    });
  }

  if (!pass || pass.length < process.env.PASSWORD_STRENGTH) {
    return res.status(412).json({
      success: false,
      reason: "password length not okay"
    });
  }

  Promise.all([db.User.create(req.body), bcrypt.hash(pass, saltRounds)])
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
          const token = jwt.sign({
              id: user.id
            },
            process.env.APP_SECRET_KEY, {
              expiresIn: process.env.APP_TOKEN_LIFETIME
            }
          );
          const profiledUser = {
            identifier: user.identifier,
            nickname: user.nickname,
            balance: wallet.balance,
            address: wallet.address,
            token: token
          };
          res.json({
            success: true,
            user: profiledUser
          });
        });
    })
    .catch(err =>
      res.status(412).json({
        success: false,
        reason: err.errors ? err.errors[0].message : err
      })
    );
});

app.post("/api/auth/login", (req, res, next) => {
  const identifier = req.body.identifier;
  const pass = req.body.password;
  let validUser = {};

  if (!identifier) {
    return res.status(412).json({
      success: false,
      reason: "identifier length not okay"
    });
  }

  if (!pass) {
    return res.status(412).json({
      success: false,
      reason: "password missing"
    });
  }

  db.User.findOne({
      where: {
        identifier: identifier
      }
    })
    .then(user => {
      if (!user)
        throw {
          success: false,
          reason: "user not found"
        };
      validUser = {
        identifier: user.identifier,
        nickname: user.nickname
      };
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
      validUser.balance = wallet.balance;
      validUser.address = wallet.address;
      return bcrypt.compare(pass, password.value);
    })
    .then(result => {
      if (result) {
        const token = jwt.sign({
            id: validUser.id
          },
          process.env.APP_SECRET_KEY, {
            expiresIn: process.env.APP_TOKEN_LIFETIME
          }
        );
        validUser.token = token;
        return res.json({
          success: true,
          user: validUser
        });
      } else
        throw {
          success: false,
          reason: "invalid password"
        };
    })
    .catch(err => {
      res.status(err.status == undefined ? 500 : err.status).json(err);
    });
});

app.put("/api/auth/update", passport.authenticate('bearer', {
  session: false
}), (req, res, next) => {
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.APP_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        reason: err.name
      });
    }
    db.User
      .update(req.body, {
        returning: true,
        where: {
          id: decoded.id
        }
      })
      .then(result => {
        return res.json({
          success: true,
          message: "User successfully updated"
        });
      })
      .catch(err => {
        return res.status(401).json({
          success: false,
          reason: err
        });
      });
  });
});

module.exports = app;
