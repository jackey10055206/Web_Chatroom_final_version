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
	cookie: {maxAge: 60*1000}
}));



// routing
router.route('/')
	.get(function(req, res){
		req.session.destroy();
		res.clearCookie('username');
		res.redirect('/login');
	});

module.exports = router;
