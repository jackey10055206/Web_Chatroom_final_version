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
			res.sendfile('./public/signup.html');
		else
			res.redirect('/chat');
	})
	.post(function(req, res){
		if(req.body.username && req.body.password && req.body.name && req.body.email)
		{
			var q = "SELECT * FROM `user` WHERE username='" + req.body.username + "' or email='" + req.body.email + "'";
			pool.query(q, function(error, results){
				if(results[0])
				{
					res.send('<script>alert("Username or Email is already used!");location.href="/signup";</script>');
				}
				else
				{
					var data = {
						username: req.body.username,
						password: req.body.password,
						name: req.body.name,
						email: req.body.email
					};
		
					pool.query('INSERT INTO `user` SET ?', data, function (error, results, fields) {
						// console.log(results);
						res.send('<script>alert("Signup Success!");location.href="/login";</script>');
					});
				}
			});
		}
		else
			res.send('<script>alert("Cannot be blank!!!");location.href="/signup";</script>');
	});

module.exports = router;
