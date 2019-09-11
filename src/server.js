require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth-route');
const jwtMW = require('express-jwt')({secret: process.env.APP_SECRET_KEY}).unless({
  path: ['/api/auth/login', '/api/auth/register']
});
app.listen(process.env.APP_PORT, () => console.log(`Listening on port ${process.env.APP_PORT}`));

// See the react auth blog in which cors is required for access
app.use((req, res, next) => {
  //todo use from .env
  res.setHeader('Access-Control-Allow-Origin', `${process.env.APP_HOST}:${process.env.APP_PORT}`);
  res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
  next();
});

// set body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// set middlewares
app.use(jwtMW);
app.use((err, req, res, next) => {
  if (err.name == 'UnauthorizedError') 
    return res
      .status(401)
      .json({success: false, reason: 'missing or invalid token'});
  next();
});

// set routers
app.all('/api/auth*', authRoute);

app.all('/api/jwt', (req, res, next) => {
  res.json({success: true});
});
