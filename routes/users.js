var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('../config');
var smtp = require('../email');
var User = mongoose.model('User');
var jwt = require('jwt-simple');

/* GET users listing. */
router.get('/:id', function(req, res, next) {
	User.findById(req.params.id, function(err, user) {
		if(err) return next(err);
		res.status(200).json(user);
	});
});

router.post('/:id', function(req, res, next) {
	User.findById(req.params.id, function(err, user) {
		if(err) return next(err);
		user.name = req.body.name;
		user.email = req.body.email;
		user.phone = req.body.phone;
		user.password = req.body.password;
		user.save(function(err) {
			if(err) return res.status(500).json(err);
			res.status(200).json(user);
		});
	});
});

module.exports = router;
