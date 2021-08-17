var express = require('express');
var router = express.Router();

const {
	getRecipeData,
	signUp,
	login,
} = require('../controllers/usersController');

const {
	checkIfInputIsEmpty,
	checkForSymbolsMiddleWare,
	checkForStrongPassword,
} = require('../lib/validator');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.post(
	'/sign-up',
	checkIfInputIsEmpty,
	checkForSymbolsMiddleWare,
	checkForStrongPassword,
	signUp
);

router.post('/login', login);

router.get('/get-recipe-data', getRecipeData);

module.exports = router;
