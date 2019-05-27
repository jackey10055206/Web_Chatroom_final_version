var express = require('express');
var router = express.Router();

// MySQL connect
var mysql = require('mysql');
var pool  = mysql.createPool({
	connectionLimit : 5,
	host            : '140.136.150.68',
	port            : '33066',
	user            : 'chess',
	password        : '880323',
	database        : 'chess'
});

// session
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore({}, pool);

router.use(session({
	name: 'user',
	secret: 'chesskuo',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	cookie: {maxAge: 24*60*60*1000}
}));



// route
module.exports = function(io){

	router.route('/')
		.get(function(req, res){
			if(!req.session.name)
				res.redirect('login');
			else
			{
				res.cookie('username', req.session.name, {maxAge: 60*60*1000});
				res.sendfile('./public/chat.html');
			}
		})

		
		// socket
		var names = [];

		io.on('connection', function(socket){

			socket.on('new user', function(data){
				socket.name = data;
				names.push(socket.name);
				socket.emit('useradd', names);
				updateUsername();
			});

			socket.on('disconnect', function(data){
				names.splice(names.indexOf(socket.name), 1);
				updateUsername();
			});

			socket.on('new msg', function(data){
				io.emit('send msg', data);
			});
		});

		function updateUsername(){
			io.emit('useradd', names);
		}

	return router;
};