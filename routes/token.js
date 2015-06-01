var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var LoginCode = mongoose.model('LoginCode');
var User = mongoose.model('User');
var jwt = require('jwt-simple');
var config = require('../config');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.post('/', function(req, res, next) {
	if(req.body.code) {
		LoginCode.findOne({code: req.body.code}, function(err, logincode) {
			if(err) return next(err);
			if(logincode) {
				console.log("Found Login Code!");
				console.log(logincode);
				if(logincode.login_type == "phone") {
					var params = {phone: logincode.login_user}
				} else {
					var params = {email: logincode.login_user}
				}
				User.findOne(params, function(err, user) {
					var phone = logincode.phone;
					LoginCode.findByIdAndRemove(logincode._id);
					if(err) return next(err);
					if(user) {
						var payload = {user_id: user._id};
						var token = jwt.encode(payload, config.jwt_key);
						res.status(200).json({user: user, token: token});
					} else {
						var user = new User(params);
						user.save(function(err, new_user) {
							if(err) return next(err);
							var payload = {user_id: new_user._id};
							var token = jwt.encode(payload, config.jwt_key);
							res.status(200).json({user: new_user, token: token});
						});
					}
				});
			} else {
				res.status(401).json({error: "Invalid login code"});	
			}
		});
	} else {
		if(req.body.email && req.body.password) {
			if(!req.body.email) return res.status(401).json({error: "Email or Password incorrect"});
			User.findOne({email: req.body.email}, function(err, user) {
				if(err) return next(err);
				if(user) {
					if(bcrypt.compareSync(req.body.password, user.password)) {
						var token = jwt.encode({id: user._id}, config.jwt_key);
						response = {user: user, token: token};
						return res.status(200).json(response);
					} else {
						return res.status(401).json({error: "Email or Password incorrect"});
					}
				} else {
					res.status(401).json({error: "Email or Password incorrect"});
				}
			});
		} else {
			res.status(401).json({error: "Email or Password incorrect"});
		}
	}
});

module.exports = router;
