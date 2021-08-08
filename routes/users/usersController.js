const mongoErrorParser = require('../lib/mongoErrorParser');
const User = require('../users/model/User');
const bcrypt = require('bcryptjs');

const signUp = async (req, res) => {
	console.log(`======signUp ran======`);
	try {
		const salted = await bcrypt.genSalt(10);

		const hashedPassword = await bcrypt.hash(req.body.password, salted);
		console.log(`======hashedPassword======`);
		console.log(hashedPassword);

		const createdUser = new User({
			email: req.body.email,
			username: req.body.username,
			password: hashedPassword,
		});
		// console.log(`======createdUser======`);
		// console.log(createdUser);

		const savedUser = await createdUser.save();
		// console.log(`======savedUser======`);
		// console.log(savedUser);

		res.json({
			data: savedUser,
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
