const app = require('express')();
const authController = require('../controllers/auth');

app.post('/api/auth/register', (req, res, next) => {
  res.json({success: true, message: "User successfully registered!"});
  next();
});

app.get('/api/auth/login', authController.login);

app.delete('/api/auth/remove', (req, res, next) => {
  res.json({success: true, message: "User successfully removed!"});
  next();
});

module.exports = app;
