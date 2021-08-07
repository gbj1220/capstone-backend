const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true,
	},

	username: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('user', UserSchema);
