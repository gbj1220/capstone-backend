var express = require('express');
var router = express.Router();

const {
	getRecipeData,
	getRecipes,
	saveRecipe,
	signUp,
	login,
} = require('../controllers/usersController');

const {
	checkForSymbolsMiddleWare,
	checkForStrongPassword,
	checkIfInputIsEmpty,
} = require('../middleWares/validator');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.post(
	'/sign-up',
	checkForSymbolsMiddleWare,
	checkForStrongPassword,
	checkIfInputIsEmpty,
	signUp
);

router.post('/login', login);

router.post('/get-recipe-data', getRecipeData);

router.post('/save-recipe', saveRecipe);

router.get('/get-recipes', getRecipes);

module.exports = router;
