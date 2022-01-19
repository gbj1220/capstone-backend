const express = require('express');

const router = express.Router();
const {
  getRecipeData,
  getRecipes,
  saveRecipe,
  signUp,
  login,
  deleteRecipe,
} = require('../controllers/usersController');

const {
  checkForSymbolsMiddleWare,
  checkForStrongPassword,
  checkIfInputIsEmpty,
} = require('../middleWares/validator');

// GET users listing.
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.get('/get-recipes', getRecipes);
// Route to sign up new user.
router.post(
  '/sign-up',
  checkForSymbolsMiddleWare,
  checkForStrongPassword,
  checkIfInputIsEmpty,
  signUp,
);

// Route for user to Login to site.
router.post('/login', login);

// Route to receive incoming data from api.
router.post('/get-recipe-data', getRecipeData);

// Route to save a recipe to favorite recipes page.
router.post('/save-recipe', saveRecipe);

// Route to delete a single recipe from favoriteRecipes page.
router.post('/delete-recipe', deleteRecipe);

module.exports = router;
