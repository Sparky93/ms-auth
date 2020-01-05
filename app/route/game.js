
const app = require("express")();
const db = require("../database");
const passport = require("passport");
const tokenValidator = require("../validator/token");

app.post("/api/game/buy",
passport.authenticate('bearer', {
  session: false
}));

module.exports = app;
