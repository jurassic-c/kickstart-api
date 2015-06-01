var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var LoginCode = mongoose.model('LoginCode');
var config = require('../config');
var smtp = require('../email');

function makeid()
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

router.post('/', function(req, res, next){
	var twilio = require('twilio')(config.twilio_sip, config.twilio_token);
	var code = makeid();
	var login_code_message = "Hey There!\n\n"
	login_code_message+= "If you want to log into " + config.domain + ", here is your login code:\n\n"
	login_code_message+= code.toUpperCase() + "\n\n"
	login_code_message+= "Sincerely,\nthe " + config.app_name + " Team"
	
	LoginCode.findOne({login_type: req.body.login_type, login_user: req.body.login_user}, function(err, code_obj) {
		if(err) return next(err);
		if(code_obj) {
			code_obj.code = code;
			code_obj.save(function(err, new_code) {
				if(err) return next(err);
				console.log("Code: " + code);
				if(req.body.login_type == "phone") {
					twilio.sendMessage({
						to: "+"+req.body.login_user,
						from: config.twilio_number,
						body: code.toUpperCase()
					});
				}
				if(req.body.login_type == "email") {
					smtp.sendMail({
						from: config.login_email_name + "@" + config.domain,
						to: req.body.login_user,
						subject: 'Healthbot Login Code',
						text: login_code_message
					});
				}
				res.status(200).json({});
			});
		} else {
			var code_obj = new LoginCode({login_type: req.body.login_type, login_user: req.body.login_user, code: code});
			code_obj.save(function(err, new_code) {
				if(err) return next(err);
				console.log("Code: " + code);
				if(req.body.login_type == "phone") {
					twilio.sendMessage({
						to: "+"+req.body.login_user,
						from: config.twilio_number,
						body: code.toUpperCase()
					});
				}
				if(req.body.login_type == "email") {
					smtp.sendMail({
						from: config.login_email_name + "@" + config.domain,
						to: req.body.login_user,
						subject: 'Healthbot Login Code',
						text: login_code_message
					});
				}
				res.status(200).json({});
			});
		}
	})
});

module.exports = router;