const app = require('express')();

app.post('/api/auth/register', (req, res, next) => {
  res.json({
    success: true,
    message: "User successfully registered!"
  });
  next();
});

app.get('/api/auth/login', (req, res, next) => {
  res.json({
    success: true,
    message: "User successfully logged in!"
  });
  next();
});

app.delete('/api/auth/remove', (req, res, next) => {
  res.json({
    success: true,
    message: "User successfully removed!"
  });
  next();
});

module.exports = app;
