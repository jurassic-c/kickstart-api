var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports = function(mongoose) {
	var LoginCodeSchema = new Schema({
		code: { type: String, required: true},
		login_user: { type: String, required: true, index: { unique: true }},
		login_true: { type: String, required: true}
	});

	return mongoose.model('LoginCode', LoginCodeSchema);
}