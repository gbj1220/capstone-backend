const {
  isEmpty, isEmail, matches, isStrongPassword,
} = require('validator');

function checkIfEmpty(target) {
  if (isEmpty(target)) {
    return true;
  }
  return false;
}

function checkIfEmailFormat(target) {
  if (isEmail(target)) {
    return true;
  }
  return false;
}

/* Shorthand
  const checkIfEmailFormat = (target) => (!!isEmail(target));
*/

function checkForSymbol(target) {
  if (matches(target, /[!@#$%^&*()[\],.?":;{}|<>]/g)) {
    return true;
  }
  return false;
}

function checkIfStrongPassword(target) {
  if (isStrongPassword(target)) {
    return true;
  }
  return false;
}

function checkIfInputIsEmpty(req, res, next) {
  const errObj = {};
  const checkedEmail = false;

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
    res.status(500).json({ message: errObj });
  } else {
    next();
  }
}

function checkForSymbolsMiddleWare(req, res, next) {
  const errorObj = {};
  const { username } = req.body;

  if (checkForSymbol(username)) {
    errorObj.username = 'First Name cannot contains special characters';
  }

  if (Object.keys(errorObj).length > 0) {
    res.status(500).json({ message: errorObj });
  } else {
    next();
  }
}

function checkIfLoginIsEmpty(req, res, next) {
  const errorObj = {};

  const { email, password } = req.body;

  if (checkIfEmpty(email)) {
    errorObj.email = 'Email cannot be empty';
  }

  if (checkIfEmpty(password)) {
    errorObj.password = 'Password cannot be empty';
  }

  if (Object.keys(errorObj).length > 0) {
    res.status(500).json({ message: errorObj });
  } else {
    next();
  }
}

function checkForStrongPassword(req, res, next) {
  const errorObj = {};

  const { password } = req.body;

  if (!checkIfStrongPassword(password)) {
    errorObj.password = 'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and at least 1 special symbol.';
  }

  if (Object.keys(errorObj).length > 0) {
    res.status(500).json({ message: errorObj });
  } else {
    next();
  }
}

module.exports = {
  checkForSymbolsMiddleWare,
  checkForStrongPassword,
  checkIfInputIsEmpty,
  checkIfLoginIsEmpty,
};
