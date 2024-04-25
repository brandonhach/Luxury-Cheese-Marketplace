const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/offerController');
const { isLoggedIn, isSeller, isAuthor } = require('../middleware/auth');

// GET /:itemId/offers/: view all offers
router.get('/', isLoggedIn, isAuthor, controller.viewOffers);

// POST /:itemId/offer/: make an offer
router.post('/', isLoggedIn, isSeller, controller.makeOffer);

//POST /:itemId/offers/:offerId/accept: accept offer
router.post('/:offerId/accept', isLoggedIn, isAuthor, controller.acceptOffer);

module.exports = router;
