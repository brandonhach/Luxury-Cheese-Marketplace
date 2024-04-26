const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middleware/auth');
const { body } = require('express-validator');

// GET /user/new: send HTML form for user signup
router.get('/new', isGuest, controller.new);

// POST /user/new: handle user signup
router.post(
	'/new',
	isGuest,
	[
		body('firstName', 'Invalid Firstname').trim().escape(),
		body('lastName', 'Invalid Lastname').trim().escape(),
		body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
		body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({
			min: 8,
			max: 64,
		}),
	],
	controller.create
);

//GET /users/login: send html for logging in
router.get('/login', isGuest, controller.getUserLogin);

//POST /users/login: authenticate user's login
router.post(
	'/login',
	isGuest,
	[
		body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
		body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({
			min: 8,
			max: 64,
		}),
	],
	controller.login
);

//GET /users/profile: send user's profile page
router.get('/profile', isLoggedIn, controller.profile);

//POST /users/logout: logout a user
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;
