const mongoErrorParser = require('../lib/mongoErrorParser');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

require('dotenv').config();

async function signUp(req, res) {
	console.log(`======signUp ran======`);
	try {
		//setting up salt to encrypt the password given to function
		const salted = await bcrypt.genSalt(10);

		//hashing password to fully encrypt it
		const hashedPassword = await bcrypt.hash(req.body.password, salted);

		//creating a new user using the UserSchema model
		const createdUser = new User({
			email: req.body.email,
			username: req.body.username,
			password: hashedPassword,
		});
		console.log(`======createdUser======`);

		//waiting for saved user promise to return
		const savedUser = await createdUser.save();

		//returning the new saved user to the client side
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

		console.log('LOGIN WORKING LINE 48');

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
		console.log(response);
		res.json({
			response,
		});
	} catch (e) {
		console.log(mongoErrorParser(e));
	}
}

module.exports = {
	getRecipeData,
	login,
	signUp,
};
