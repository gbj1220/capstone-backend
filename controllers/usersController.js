const RecipeSchema = require('../model/SavedRecipes');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
//requiring in dotenv so that I can access my .env file and change my port accordingly
require('dotenv').config();

async function signUp(req, res) {
	try {
		//setting up salt to encrypt the password given to function
		let salted = await bcrypt.genSalt(10);

		//hashing password to fully encrypt it
		let hashedPassword = await bcrypt.hash(req.body.password, salted);

		//creating a new user using the UserSchema model
		let createdUser = new User({
			email: req.body.email,
			username: req.body.username,
			password: hashedPassword,
		});

		//waiting for saved user promise to return
		let savedUser = await createdUser.save();

		//returning the new saved user to the client side
		res.json({
			savedUser,
		});
	} catch (err) {
		//if an err occurs, return a 400 error and return the err response to the client side
		res.status(400).json({
			err,
		});
	}
}

async function login(req, res) {
	//create a var to store result of querying DB for username
	try {
		let foundUser = await User.findOne({ username: req.body.username });

		//throw an error if the username is not in the DB
		if (!foundUser) {
			throw 'Username not found';
		}

		//using bcrypt to compare what the user typed in against what is in the DB
		let comparedPassword = await bcrypt.compare(
			req.body.password,
			foundUser.password
		);

		//if the password is incorrect throw an error message otherwise create a new jwtToken and assign it to the user
		if (!comparedPassword) {
			throw 'Password and Username must match';
		} else {
			let jwtToken = jwt.sign(
				{
					username: foundUser.username,
				},
				process.env.JWT_SECRET,
				{ expiresIn: '3h' }
			);

			//returning the jwtToken
			res.json({ jwtToken });
		}
	} catch (err) {
		console.log(`====== err ======`);
		console.log(err);
		res.json({ err }).status(400);
	}
}

//creating an async function in order to call the recipe api
async function getRecipeData(req, res) {
	try {
		//destructuring req object
		const { usrInput } = req.body;

		//creating a var the save the api call response to
		let response = await axios.get(
			'https://edamam-recipe-search.p.rapidapi.com/search',
			{
				params: { q: usrInput },
				headers: {
					'x-rapidapi-key': process.env.FOOD_API_KEY,
					'x-rapidapi-host': process.env.FOOD_API_HOST,
				},
			}
		);

		//returning the data
		res.json({ data: response.data });
	} catch (err) {
		//otherwise send back err object to client side
		res.status(400).json({ err });
	}
}

//function which adds a selected recipe to the users DB
async function saveRecipe(req, res) {
	//destructuring req object
	try {
		const { label, image, recipeLink } = req.body;

		//using the RecipeSchema to save a recipe to users DB
		let recipe = await new RecipeSchema({
			label,
			image,
			recipeLink,
		});

		let newSavedRecipe = await recipe.save();

		let token = req.headers.authorization.slice(7);
		console.log(`====== token ======`);
		console.log(token);

		let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		console.log(`====== decodedToken ======`);
		console.log(decodedToken);

		let targetUser = await User.findOne({
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
	} catch (err) {
		res.status(400).json({
			err,
		});
	}
}

//maybe do an onClick handler for the view saved recipes button || useEffect on UsersRecipes.js to always pull new data when component is loaded.

async function getRecipes(req, res) {
	try {
		let jwtToken = req.headers.authorization.slice(7);
		let decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
		let payload = await User.findOne({ username: decodedToken.username })
			.populate({
				path: 'recipes',
				model: 'savedRecipe',
				select: '-__v',
			})
			.select('-email -username -password');
		res.json(payload);
	} catch (err) {
		res.status(400).json({
			err,
		});
	}
}

module.exports = {
	getRecipeData,
	getRecipes,
	saveRecipe,
	login,
	signUp,
};
