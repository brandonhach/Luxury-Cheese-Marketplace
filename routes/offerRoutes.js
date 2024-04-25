const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/offerController');
const { isLoggedIn, isSeller } = require('../middleware/auth');

// GET /:itemId/offers/: view all offers
// router.get('/', isGuest, controller.viewOffer);

// POST /:itemId/offer/: make an offer
router.post('/', isLoggedIn, isSeller, controller.makeOffer);

// //POST /:itemId/offers/:offerId/accept: accept offer
// router.post('/:offerId/accept', isLoggedIn, controller.acceptOffer);

module.exports = router;
