const Cheese = require('../models/cheese');
const model = require('../models/offer');

/**POST /post_cheese : create a new cheese listing x */
exports.makeOffer = (req, res, next) => {
	let cheeseId = req.params.id;
	let userId = req.session.user;

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
			.then(res.redirect(`/listing/item/${cheeseId}`))
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
