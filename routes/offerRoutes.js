const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/offerController');
const { isLoggedIn } = require('../middleware/auth');

// GET /:itemId/offers/: send HTML form for user signup
// router.get('/', isGuest, controller.viewOffer);

// // POST /:itemId/offers/: handle user signup
// router.post('/', isLoggedIn, controller.makeOffer);

// //POST /:itemId/offers/:offerId/accept: authenticate user's login
// router.post('/:offerId/accept', isLoggedIn, controller.acceptOffer);

module.exports = router;
