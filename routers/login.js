var express = require('express');
var router = express.Router();

// POST object 
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

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



// routing
router.route('/')
	.get(function(req, res){
		if(!req.session.name)
			res.sendfile('./public/login.html');
		else
			res.redirect('/chat');
	})
	.post(function(req, res){
		if(req.body.account && req.body.password)
		{
			var query = "SELECT username FROM `user` WHERE username='" + req.body.account + "' AND password='" + req.body.password + "'";

			pool.query(query, function (error, results, fields) {
				if(results[0])
				{
					req.session.name = results[0].username;
					res.write('<script>location.href="/chat";</script>');
					res.end();
				}
				else
				{
					res.write('<script>alert("Wrong Username or Password!!!");location.href="/login";</script>');
					res.end();
				}
			});
		}
		else
			res.redirect('/login');
	});

module.exports = router;
