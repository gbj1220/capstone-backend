const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
	label: {
		type: String,
	},
	image: {
		type: String,
	},
	recipeLink: {
		type: String,
	},
});

module.exports = mongoose.model('savedRecipe', RecipeSchema);