var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);



// main
app.use(express.static('public'));

app.use('/login', require('./routers/login.js'));
app.use('/logout', require('./routers/logout.js'));
app.use('/signup', require('./routers/signup.js'));
app.use('/chat', require('./routers/chat.js')(io));

app.get('/', function(req, res){
	res.redirect('/login');
});

app.use(function(req, res){
	res.status(404).sendfile('public/404.html');
});



// server start
http.listen(8888, function(){
	console.log('Listen on http://localhost:8888 ...');
});