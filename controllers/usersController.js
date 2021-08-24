const mongoErrorParser = require('../lib/mongoErrorParser');
const User = require('../model/User');
const RecipeSchema = require('../model/SavedRecipes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
			throw 'Username not found';
		}

		const comparedPassword = await bcrypt.compare(
			req.body.password,
			foundUser.password
		);

		if (!comparedPassword) {
			throw 'Password and Username must match';
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
		console.log(`====== getRecipeData ran backend ======`);
		const { usrInput } = req.body;
		console.log(`====== usrInput backend ======`);
		console.log(usrInput);
		const response = await axios.get(
			'https://edamam-recipe-search.p.rapidapi.com/search',
			{
				params: { q: usrInput },
				headers: {
					'x-rapidapi-key': process.env.FOOD_API_KEY,
					'x-rapidapi-host': process.env.FOOD_API_HOST,
				},
			}
		);
		console.log(`====== response ======`);
		console.log(response.data);
		res.json({
			data: response.data,
		});
	} catch (e) {
		res.status(500);
		console.log(mongoErrorParser(e));
	}
}

async function saveRecipe(req, res) {
	try {
		const { label, image, recipeLink } = req.body;

		const recipe = await new RecipeSchema({
			label,
			image,
			recipeLink,
		});

		const newSavedRecipe = await recipe.save();

		const token = req.headers.authorization.slice(7);
		console.log(`====== token ======`);
		console.log(token);

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		console.log(`====== decodedToken ======`);
		console.log(decodedToken);

		const targetUser = await User.findOne({
			username: decodedToken.username,
		});

		console.log(`====== target user ======`);
		console.log(targetUser);
		targetUser.recipes.push(newSavedRecipe._id);
		console.log(`====== new saved recipe ======`);
		console.log(newSavedRecipe);

		await targetUser.save();

		res.json({
			newSavedRecipe,
		});
	} catch (error) {
		console.log(mongoErrorParser(error));
	}
}

//maybe do an onClick handler for the view saved recipes button || useEffect on UsersRecipes.js to always pull new data when component is loaded.

async function getRecipes(req, res) {
	try {
		const jwtToken = req.headers.authorization.slice(7);
		const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
		const payload = await User.findOne({ username: decodedToken.username })
			.populate({
				path: 'recipes',
				model: 'savedRecipe',
				select: '-__v',
			})
			.select('-email -username -password');
		console.log(`====== payload 158 ======`);
		console.log(payload);
		res.json(payload);
	} catch (error) {
		console.log(mongoErrorParser(error));
	}
}

module.exports = {
	getRecipeData,
	getRecipes,
	saveRecipe,
	login,
	signUp,
};
