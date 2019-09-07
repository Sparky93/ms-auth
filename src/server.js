const app = require('express')();
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth-route');

app.listen(8080, () => {
  console.log("Listening on port 8080!");
});
// set body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// set routers
app.all('/api/auth*', authRoute);
