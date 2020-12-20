const jwt = require("jsonwebtoken");
const passportValidator = require("passport").authenticate('bearer', {
  session: false
});
const jwtValidator = (req, res, next) => {
  if (req.headers.authorization) {
    jwt.verify(req.headers.authorization.split(' ')[1],
      process.env.APP_SECRET_KEY,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: err.name
          });
        }
        res.locals.id = decoded.id;
        next();
      });
  } else {
    return res.status(401).json({ success: false, message: 'No token provided.' });
  }
};

module.exports.validate = (passportValidator, jwtValidator);
module.exports.sign = (user) => {
  user.token = jwt.sign({
    id: user.id
  },
    process.env.APP_SECRET_KEY, {
    expiresIn: process.env.APP_TOKEN_LIFETIME
  });
}
