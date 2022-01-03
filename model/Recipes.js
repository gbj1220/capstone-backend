const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Recipes', recipeSchema);
