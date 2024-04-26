const Cheese = require('../models/cheese');
const model = require('../models/offer');
const { validationResult } = require('express-validator');

/**POST /post_cheese : create a new cheese listing x */
exports.makeOffer = (req, res, next) => {
	let cheeseId = req.params.id;
	let userId = req.session.user;

	let errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach((error) => {
			req.flash('error', error.msg);
		});
		return res.redirect(`/listing/item/${cheeseId}`);
	}

	// Find the cheese listing first
	Cheese.findById(cheeseId)
		.then((cheese) => {
			if (cheese.author.toString() === userId.toString()) {
				let err = new Error('You cannot make an offer on your own listing');
				err.status = 401;
				return next(err);
			}
			try {
				const offer = new model({
					cheese: cheeseId,
					user: userId,
					amount: req.body.amount,
				});

				offer
					.save()
					.then((offer) => {
						return Cheese.findByIdAndUpdate(
							cheeseId,
							{
								$max: { highestOffer: offer.amount },
								$inc: { totalOffers: 1 },
							},
							{ new: true }
						);
					})
					.then(() => res.redirect(`/listing/item/${cheeseId}`))
					.catch((err) => {
						if (err.name === 'ValidationError') {
							err.status = 400;
						}
						next(err);
					});
			} catch (err) {
				if (err.name === 'ValidationError') {
					err.status = 400;
				}
				console.log('Failed to create offer:', err);
				next(err);
			}
		})
		.catch((err) => next(err));
};

// GET /:itemId/offers/: view all offers
exports.viewOffers = (req, res) => {
	let cheeseId = req.params.id;
	try {
		model
			.find({ cheese: cheeseId })
			.populate('user')
			.populate('cheese')
			.then((offers) => res.render('./user/offers/viewOffers', { offers: offers }))
			.catch((err) => {
				if (err.name === 'ValidationError') {
					err.status = 400;
				}
				next(err);
			});
	} catch (err) {
		if (err.name === 'ValidationError') {
			err.status = 400;
		}
		console.log('Failed to create offer:', err);
		next(err);
	}
};

//POST /:itemId/offers/:offerId/accept: accept offer
exports.acceptOffer = (req, res, next) => {
	let cheeseId = req.params.id;
	let offerId = req.params.offerId;
	try {
		Cheese.findById(cheeseId)
			.then((cheese) => {
				cheese.active = false;
				return cheese.save();
			})
			.catch((err) => {
				if (err.name === 'ValidationError') {
					err.status = 400;
				}
				next(err);
			});
		model
			.find({ cheese: cheeseId })
			.then((offers) => {
				offers.forEach(async (offer) => {
					if (offer.id === offerId) {
						offer.status = 'accepted';
					} else {
						offer.status = 'rejected';
					}
					await offer.save();
				});
				res.redirect(`/listing/item/${cheeseId}/offers`);
			})
			.catch((err) => {
				if (err.name === 'ValidationError') {
					err.status = 400;
				}
				next(err);
			});
	} catch (err) {
		if (err.name === 'ValidationError') {
			err.status = 400;
		}
		console.log('Failed to create offer:', err);
		next(err);
	}
};
