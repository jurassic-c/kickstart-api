var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('./config');
var bcrypt = require('bcrypt');
var salt_factor = 10;
var uniqueValidator = require('mongoose-unique-validator');

var LoginCode = new Schema({
	code: { type: String, required: true},
	login_user: { type: String, required: true, index: { unique: true }},
	login_type: { type: String, required: true}
});

var User = new Schema({
	name: { type: String},
	phone: { type: String, index: { unique: true, sparse: true }},
	email: { type: String, index: { unique: true, sparse: true }},
	password: { type: String }
});

User.pre('save', function(next) {
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(salt_factor, function(err, salt) {
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	})
});

User.plugin(uniqueValidator);

mongoose.model( 'LoginCode', LoginCode );
mongoose.model( 'User', User );
mongoose.connect( 'mongodb://' + config.mongo_addr + '/healthbot' );
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));