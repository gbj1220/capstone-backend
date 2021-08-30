// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;

// const User = require('../model/User');
// const secret_key = process.env.JWT_SECRET;

// const jwtOpts = {};
// jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// jwtOpts.secretOrKey = secret_key;

// const userJwtLoginStrategy = new JwtStrategy(jwtOpts, async (payload, done) => {
// 	const userUsername = payload.username;
// 	console.log(`====== user passport auth ======`);
// 	console.log(userUsername);

// 	try {
// 		const user = await User.findOne({ username: userUsername }).select(
// 			'-password'
// 		);
// 		if (!user) {
// 			return done(null, false);
// 		} else {
// 			return done(null, user);
// 		}
// 	} catch (error) {
// 		console.log(`====== passport auth error ======`);
// 		return done(e, false);
// 	}
// });
