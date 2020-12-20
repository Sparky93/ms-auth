const app = require("express")();
const db = require("../database");
const tokenValidator = require("../validator/token");
const fieldValidator = require("../validator/field");
const { pathToRegexp, match, parse, compile } = require("path-to-regexp");

app.post("/api/link/generate2/:nickname",
  tokenValidator.validate,
  (req, res, next) => {
    Promise
      .all([
        db.Wallet.findOne({
          where: {
            userId: res.locals.id
          }
        }),
        db.Raffle.findOne({
          where: {
            id: req.body.raffleId
          }
        })
      ])
      .then(([wallet, raffle]) => {
        res.locals.balance = wallet.balance;
        res.locals.raffleId = raffle.id;
        return db.Type.findOne({
          where: {
            id: raffle.typeId
          }
        });
      })
      .then(type => {
        res.locals.price = type.price;
        if (res.locals.balance - type.price < 0) return res.json({
          success: false,
          message: "insuficient funds"
        });

        return db.Ticket.create({
          userId: res.locals.id,
          raffleId: res.locals.raffleId
        })
      })
      .then(ticket => {
        //TODO db.Wallet.update(); decrease the balance with the price
        res.json({
          success: true,
          ticket
        });
      });
  }
);

app.get("/api/link/:nickname",
  //tokenValidator.validate,
  (req, res, next) => {
    let nick = pathToRegexp("/api/link/:nickname").exec(req.path)[1];

    db.User.findOne({ where: { nickname: nick } }).then(user => {
      if (user) {
        db.Link.findAll({ where: { userId: user.id } }).then(links => {
          res.json(links);
        });
      } else {
        res.json({
          success: false,
          reason: 'User not found'
        });
      }
    });
  }
);

app.post("/api/link/:nickname",
  tokenValidator.validate,
  fieldValidator.description,
  fieldValidator.value,
  (req, res, next) => {
    let nick = pathToRegexp("/api/link/:nickname").exec(req.path)[1];
    let tkn = req.headers.authorization.split(' ')[1];
    db.User.findOne({ where: { nickname: nick, token: tkn } })
      .then(user => {
        return db.Link.create({ userId: user.id, value: req.body.value, description: req.body.description });
      }).then(link => res.json(link));
  });

app.put("/api/link/:nickname/:id",
  tokenValidator.validate,
  (req, res, next) => {
    let regexp = pathToRegexp("/api/link/:nickname/:id").exec(req.path)
    let nick = regexp[1];
    let linkId = regexp[2];
    let tkn = req.headers.authorization.split(' ')[1];

    db.User.findOne({ where: { token: tkn, nickname: nick } })
      .then(user => {
        if (!user) throw ('No user found with this token');
        else return db.Link.findOne({ where: { id: linkId, userId: user.id } })
      })
      .then(link => {
        if (!link) throw ('No link found with this id');
        else return link.update({ description: req.body.description, value: req.body.value })
      })
      .then(link => {
        res.json({ success: true, link });
      })
      .catch(msg => {
        res.json({ success: false, message: msg });
      });
  }
);

module.exports = app;
