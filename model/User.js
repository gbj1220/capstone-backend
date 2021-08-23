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
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	recipes: [{ type: mongoose.Schema.ObjectId, ref: 'recipes' }],
});

module.exports = mongoose.model('user', UserSchema);
