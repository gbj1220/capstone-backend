var express = require('express');
var router = express.Router();

const { signUp } = require('../controllers/usersController');

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

module.exports = router;
