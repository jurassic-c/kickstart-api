var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports = function(mongoose) {

	var UserSchema = new Schema({
		name: { type: String, required: true},
		phone: { type: String, index: { unique: true }},
		email: { type: String, index: { unique: true }},
	});

	return mongoose.model('User', UserSchema);
}