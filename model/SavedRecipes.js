const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
	label: {
		type: String,
	},
	recipeLink: {
		type: String,
	},
});

module.exports = mongoose.model('recipe', RecipeSchema);
