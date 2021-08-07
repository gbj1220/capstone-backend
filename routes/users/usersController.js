const mongoErrorParser = require("../lib/mongoErrorParser")
const User = require("../users/model/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


module.exports = {
  signUp = async (req, res) => {
    try {
      let salted = await bcrypt.genSalt(10);

      let hashedPassword = await bcrypt.hash(req.body.password, salted)

      const {username, email} = req.body;

      let createdUser = new User({
        email,
        username, 
        password: hashedPassword
      })

      let savedUser = await createdUser.savedUser()
      res.json({
        payload: savedUser
      })

    } catch (error) {
      res.status(500).json({mongoErrorParser(error)})
      console.log(`======usersController signUp error ran======`)
    }
  }
}