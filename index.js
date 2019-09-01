var express = require('express');

var app = express();

//view engine setup
app.set('views', 'views');
app.set('view engine', 'pug');

app.use(express.static('public'));

app.listen(8080, function() {
	console.log("Listening on port 8080!");
});

app.get('/', function(req, res) {
	res.render('hello', {title: 'hello', message: 'there'});
});