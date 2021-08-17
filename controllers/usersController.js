const mongoErrorParser = require('../lib/mongoErrorParser');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

require('dotenv').config();

async function signUp(req, res) {
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
		console.log(`======createdUser======`);

		const savedUser = await createdUser.save();

		res.json({
			savedUser,
		});
	} catch (error) {
		res.status(500).json(mongoErrorParser(error));
		console.log(error);
		console.log(`======usersController signUp error ran======`);
	}
}

async function login(req, res) {
	try {
		const foundUser = await User.findOne({ username: req.body.username });

		if (!foundUser) {
			throw { message: 'Email is not registered' };
		}

		const comparedPassword = await bcrypt.compare(
			req.body.password,
			foundUser.password
		);

		if (!comparedPassword) {
			throw { message: 'Incorrect username and or password' };
		} else {
			const jwtToken = jwt.sign(
				{
					username: foundUser.username,
				},
				process.env.JWT_SECRET,
				{ expiresIn: '3h' }
			);

			res.json({
				jwtToken,
			});
		}
	} catch (e) {
		res.status(500).json({
			message: e.message,
		});
		console.log(e);
	}
}

//creating an async function in order to call the recipe api
async function getRecipeData(req, res) {
	try {
		const { data } = req.body;
		const response = await axios.get(
			'https://edamam-recipe-search.p.rapidapi.com/search',
			{
				params: { q: data },
				headers: {
					'x-rapidapi-key': process.env.FOOD_API_KEY,
					'x-rapidapi-host': process.env.FOOD_API_HOST,
				},
			}
		);

		res.json({
			response,
		});
	} catch (e) {
		console.log(mongoErrorParser(e));
	}
}

module.exports = {
	signUp,
	login,
	getRecipeData,
};
