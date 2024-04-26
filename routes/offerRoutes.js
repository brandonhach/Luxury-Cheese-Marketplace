const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/offerController');
const { isLoggedIn, isAuthor } = require('../middleware/auth');
const { body } = require('express-validator');

// GET /:itemId/offers/: view all offers
router.get('/', isLoggedIn, isAuthor, controller.viewOffers);

// POST /:itemId/offer/: make an offer
router.post(
	'/',
	isLoggedIn,
	[body('amount', 'Offer must be between $10 - $10000').trim().isFloat({ min: 10, max: 10000 })],
	controller.makeOffer
);

//POST /:itemId/offers/:offerId/accept: accept offer
router.post('/:offerId/accept', isLoggedIn, isAuthor, controller.acceptOffer);

module.exports = router;
