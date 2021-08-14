const mongoErrorParser = require('../lib/mongoErrorParser');
const User = require('../model/User');
const bcrypt = require('bcryptjs');

const signUp = async (req, res) => {
	console.log(`======signUp ran======`);
	try {
		let salted = await bcrypt.genSalt(10);

		let hashedPassword = await bcrypt.hash(req.body.password, salted);
		console.log(`======hashedPassword======`);
		console.log(hashedPassword);

		let createdUser = new User({
			email: req.body.email,
			username: req.body.username,
			password: hashedPassword,
		});
		console.log(`======createdUser======`);

		let savedUser = await createdUser.save();

		res.json({
			savedUser,
		});
	} catch (error) {
		res.status(500).json(mongoErrorParser(error));
		console.log(error);
		console.log(`======usersController signUp error ran======`);
	}
};

module.exports = {
	signUp,
};
