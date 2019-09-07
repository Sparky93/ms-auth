const app = require('express')();
const authController = require('../controllers/auth-controller');

app.post('/api/auth/register', authController.register);

app.get('/api/auth/login', authController.login);

app.delete('/api/auth/remove', (req, res, next) => {
  res.json({success: true, message: "User successfully removed!"});
  next();
});

module.exports = app;
