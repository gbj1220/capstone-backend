/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const User = require('../model/User');
const Recipe = require('../model/Recipes');

// requiring in dotenv so that I can access .env file and change my port accordingly
require('dotenv').config();

async function signUp(req, res) {
  try {
    // setting up salt to encrypt the password given to function
    const salted = await bcrypt.genSalt(10);

    // hashing password to fully encrypt it
    const hashedPassword = await bcrypt.hash(req.body.password, salted);

    // creating a new user using the UserSchema model
    const createdUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });

    // waiting for saved user promise to return
    const savedUser = await createdUser.save();

    // returning the new saved user to the client side
    res.json({
      savedUser,
    });
  } catch (err) {
    // if an err occurs, return a 400 error and return the err response to the client side
    res.status(400).json({
      err,
    });
  }
}

async function login(req, res) {
  // create a var to store result of querying DB for username
  try {
    const foundUser = await User.findOne({ username: req.body.username });

    // using bcrypt to compare what the user typed in against what is in the DB
    const comparedPassword = await bcrypt.compare(
      req.body.password,
      foundUser.password,
    );

    // if the password is incorrect throw an
    // error message otherwise create a new jwtToken
    // and assign it to the user
    if (!comparedPassword) {
      res.json({ err: "Password's do not match" });
    } else {
      const jwtToken = jwt.sign(
        {
          email: foundUser.email,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
        },
        process.env.SECRET_SQUIRREL_STUFF,
        { expiresIn: '24h' },
      );
      res.json({
        jwtToken,
      });
    }
  } catch (err) {
    res.status(500).json({ err });
  }
}

// creating an async function in order to call the recipe api
async function getRecipeData(req, res) {
  try {
    // destructuring req object
    const { usrInput } = req.body;

    // creating a var the save the api call response to
    const response = await axios.get(
      'https://edamam-recipe-search.p.rapidapi.com/search',
      {
        params: { q: usrInput },
        headers: {
          'x-rapidapi-key': process.env.FOOD_API_KEY,
          'x-rapidapi-host': process.env.FOOD_API_HOST,
        },
      },
    );
    const { data } = response;
    // returning the data
    res.json({ data });
  } catch (err) {
    // otherwise send back err object to client side
    res.status(400).json({ err });
  }
}

// function which adds a selected recipe to the users DB
async function saveRecipe(req, res) {
  try {
    const { label, image, recipeLink } = req.body;

    const newRecipe = await new Recipe({
      label,
      image,
      recipeLink,
    });

    const saveNewRecipe = await newRecipe.save();

    const token = req.headers.authorization.slice(7);

    const currentUser = jwt.verify(token, process.env.SECRET_SQUIRREL_STUFF);

    const response = await User.findOne({ email: currentUser.email });

    response.recipes.push(saveNewRecipe._id);

    await response.save();

    res.json(saveNewRecipe);
  } catch (err) {
    console.log(`====== err: ${err} ======`);
    res.status(500).json({
      err,
    });
  }
}

async function getRecipes(req, res) {
  try {
    const token = req.headers.authorization.slice(7);

    const decodedToken = jwt.verify(token, process.env.SECRET_SQUIRREL_STUFF);

    const payload = await User.findOne({
      email: decodedToken.email,
    }).populate('recipes');

    res.json(payload);
  } catch (err) {
    console.log(`====== err: ${err} ======`);
    res.status(400).json({
      err,
    });
  }
}

async function deleteRecipe(req, res) {
  try {
    // Sending the ID of the object I want to delete from database.
    const { id } = req.body;
    // console.log('====== THIS IS THE ID!!! ======');
    // console.log(id);

    // Grabbing the jwtToken that is being sent via header.
    const token = req.headers.authorization.slice(7);

    // Finding the current user so that I can access their array of recipes.
    const currentUser = jwt.verify(token, process.env.SECRET_SQUIRREL_STUFF);

    /*  Finding the current user and populating the recipes arr before
    filtering out the specified ID. */
    const payload = await User.findOne({ email: currentUser.email }).populate('recipes');

    // Filtering the users recipes array to remove item.
    payload.recipes.filter((recipe) => recipe._id !== id);
    payload.save();

    console.log('====== PAYLOAD ======');
    console.log(payload);

    res.json(payload);
  } catch (err) {
    res.status(500).json({ err });
  }
}

module.exports = {
  getRecipeData,
  getRecipes,
  saveRecipe,
  login,
  signUp,
  deleteRecipe,
};
