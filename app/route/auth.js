const app = require("express")();
const db = require("../database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const passport = require("passport");

app.post("/api/auth/register", (req, res, next) => {
  let pass = req.body.password;

  if (!pass || pass.length < process.env.PASSWORD_STRENGTH) {
    return res
      .status(412)
      .json({ success: false, reason: "password length not okay" });
  }

  Promise.all([db.User.create(req.body), bcrypt.hash(pass, saltRounds)])
    .then(([user, hash]) => {
      db.Password.create({ userId: user.id, value: hash });
      let token = jwt.sign(
        {
          id: user.id
        },
        process.env.APP_SECRET_KEY,
        { expiresIn: process.env.APP_TOKEN_LIFETIME }
      );
      res.json({ success: true, user, token });
    })
    .catch(err =>
      res.status(412).json({ success: false, reason: err.errors[0].message })
    );
});

app.post("/api/auth/login", (req, res, next) => {
  const inputIdentifier = req.body.identifier;
  const inputPassword = req.body.password;
  let validUser = null;

  if (!inputIdentifier) {
    return res
      .status(412)
      .json({ success: false, reason: "identifier length not okay" });
  }

  if (!inputPassword) {
    return res.status(412).json({ success: false, reason: "password missing" });
  }

  db.User.findOne({
    where: { identifier: inputIdentifier }
  })
    .then(user => {
      if (!user)
        throw {
          success: false,
          reason: "user not found"
        };
      validUser = user;
      return db.Password.findOne({
        where: {
          userId: user.id
        }
      });
    })
    .then(password => {
      return bcrypt.compare(inputPassword, password.value);
    })
    .then(result => {
      if (result) {
        const token = jwt.sign(
          {
            id: validUser.id
          },
          process.env.APP_SECRET_KEY,
          { expiresIn: process.env.APP_TOKEN_LIFETIME }
        );
        return res.json({ success: true, user: validUser, token: token });
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

app.put("/api/auth/update", passport.authenticate('bearer', {session: false}), (req, res, next) => {
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.APP_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({success: false, reason: err.name});
      }
      db.User
        .update(req.body, {returning: true, where: {id: decoded.id}})
        .then(result => {
          return res.json({success: true, message: "User successfully updated"});
        })
        .catch(err => {
          return res.status(401).json({success: false, reason: err});
        });
    });
});

app.delete("/api/auth/remove", passport.authenticate('bearer', {session: false}), (req, res, next) => {
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.APP_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({success: false, reason: err.name});
    }
    db.User
      .findOne({where: {id: decoded.id}})
      .then(user => {
        if (user.id == decoded.id) {
          db.User.destroy({where : {id: decoded.id}});
          return res.json({success: true, message: "User succesfully removed"});
        }
      })
      .catch(err => {
        return res.status(401).json({success: false, reason: "Couldn't find any user"});
      });
  });
});

module.exports = app;
