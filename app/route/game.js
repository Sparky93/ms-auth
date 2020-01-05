const app = require("express")();
const db = require("../database");
const passport = require("passport");
const tokenValidator = require("../validator/token");

app.post("/api/game/buyTicket",
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

app.get("/api/game/getMyTickets",
  tokenValidator.validate,
  (req, res, next) => {

  }
);

app.get("/api/game/getRaffles",
  (req, res, next) => {

  }
);

module.exports = app;
