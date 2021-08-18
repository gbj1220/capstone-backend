var express = require('express');
var router = express.Router();

const turkeyObj = require('../../turkey.json');

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
router.get('/api/', function (req, res, next) {
	res.send('respond with a resource');
});

router.post(
	'/api/sign-up',
	checkIfInputIsEmpty,
	checkForSymbolsMiddleWare,
	checkForStrongPassword,
	signUp
);

router.post('/api/get-recipe-data', function (req, res, next) {
	res.send(turkeyObj);
});

router.post('/api/login', login);

// router.post('/get-recipe-data', getRecipeData);

module.exports = router;
