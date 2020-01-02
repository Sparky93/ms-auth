require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const authRoute = require('./route/auth');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const BearerStrategy = require('passport-http-bearer').Strategy;

app.listen(process.env.APP_PORT, () => console.log(`Listening on port ${process.env.APP_PORT}`));

// set body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// set middlewares
app.use(passport.initialize());

passport.use(new BearerStrategy((token, done) => {
  jwt.verify(token, process.env.APP_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(err.name);
      switch (err.name) {
        case 'TokenExpiredError': // token expired
          break;
        case 'JsonWebTokenError': // malformed or invalid token
          next(err);
          break;
        default:
          return done(err);
          break;
      }
    } else {
      next();
    }
  });
}));

// set routers
app.all('/api/auth*', authRoute);

app.all('/api/jwt', passport.authenticate('bearer', {session: false}), (req, res, next) => {
  res.json({success: true});
});
