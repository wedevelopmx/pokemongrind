var express = require('express');
var router = express.Router();
var models  = require('../models');

//Authentication API routes
module.exports = function(passport) {

	router.get('/google',
		passport.authenticate('google', { scope : ['profile', 'email'] }));

	// the callback after google has authenticated the user
	router.get('/google/callback',
		passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/#loginError'
        }));

	router.get('/logout', function(req, res){
		req.logout();
		res.send(200);
	});

	// route to test if the user is logged in or not
	router.get('/loggedin', function(req, res) {
		if(req.isAuthenticated())
			req.user.user_permissions = ['admin'];
		res.json(req.isAuthenticated() ? req.user : null);
	});

	return router;
}
