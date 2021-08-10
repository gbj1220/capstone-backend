const { isEmpty, isEmail, matches, isStrongPassword } = require('validator');
const mongoDBErrorHelper = require('./mongoErrorParser');

const checkIfEmpty = (target) => {
	if (isEmpty(target)) {
		return true;
	} else {
		return false;
	}
};

const checkIfEmailFormat = (target) => {
	if (isEmail(target)) {
		return true;
	} else {
		return false;
	}
};

const checkForSymbol = (target) => {
	if (matches(target, /[!@#$%^&*()\[\],.?":;{}|<>]/g)) {
		return true;
	} else {
		return false;
	}
};

const checkIfStrongPassword = (target) => {
	if (isStrongPassword(target)) {
		return true;
	} else {
		return false;
	}
};

const checkIfInputIsEmpty = (req, res, next) => {
	let errObj = {};
	let checkedEmail = false;

	const { email, username, password } = req.body;

	if (checkIfEmpty(email)) {
		errObj.email = 'Email cannot be empty.';
	}

	if (checkIfEmpty(username)) {
		errObj.username = 'Username cannot be empty.';
	}

	if (checkIfEmpty(password)) {
		errObj.password = 'Password cannot be empty.';
	}

	if (!checkedEmail) {
		if (!checkIfEmailFormat) {
			errObj.email = 'Must be in email format.';
		}
	}

	if (Object.keys(errObj).length > 0) {
		res.status(500).json(mongoDBErrorHelper({ message: errObj }));
	} else {
		next();
	}
};

const checkForSymbolsMiddleWare = (req, res, next) => {
	let errorObj = {};
	let { username } = req.body;

	if (checkForSymbol(username)) {
		errorObj.username = 'First Name cannot contains special characters';
	}

	if (Object.keys(errorObj).length > 0) {
		res.status(500).json(mongoDBErrorHelper({ message: errorObj }));
	} else {
		next();
	}
};

const checkIfLoginIsEmpty = (req, res, next) => {
	let errorObj = {};

	const { email, password } = req.body;

	if (checkIfEmpty(email)) {
		errorObj.email = 'Email cannot be empty';
	}

	if (checkIfEmpty(password)) {
		errorObj.password = 'Password cannot be empty';
	}

	if (Object.keys(errorObj).length > 0) {
		res.status(500).json(mongoDBErrorHelper({ message: errorObj }));
	} else {
		next();
	}
};

const checkForStrongPassword = (req, res, next) => {
	let errorObj = {};

	const { password } = req.body;

	if (!checkIfStrongPassword(password)) {
		errorObj.password =
			'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and at least 1 special symbol.';
	}

	if (Object.keys(errorObj).length > 0) {
		res.status(500).json(mongoDBErrorHelper({ message: errorObj }));
	} else {
		next();
	}
};

module.exports = {
	checkIfInputIsEmpty,
	checkForSymbolsMiddleWare,
	checkIfLoginIsEmpty,
	checkForStrongPassword,
};
