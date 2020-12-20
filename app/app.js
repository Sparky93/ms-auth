require("dotenv").config();
const app = require("express")();
const bodyParser = require("body-parser");
const authRoute = require("./route/auth");
const linkRoute = require("./route/link");
const BearerStrategy = require("passport-http-bearer").Strategy;
const passport = require("passport");

passport.use(new BearerStrategy((token, done) => {
  //TODO also check if this token is associated in the database
  jwt.verify(token, process.env.APP_SECRET_KEY, (err, decoded) => {
    if (!err) {
      return done(null, true);
    }

    if (err.name == "TokenExpiredError") {
      return done(null, false, {
        success: false,
        reason: "token expired"
      });
    }

    if (err.name == "JsonWebTokenError") {
      return done(null, false, {
        success: false,
        reason: "token invalid"
      });
    }
    return done(null, false, {
      success: false,
      reason: err.name
    });
  });
}));

app.listen(process.env.APP_PORT, () =>
  console.log(`Listening on port ${process.env.APP_PORT}`)
);

// set body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// set middlewares
app.use(passport.initialize());

// set routers
app.use(authRoute, linkRoute);
