const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'User reference is required'],
	},
	cheese: {
		type: Schema.Types.ObjectId,
		ref: 'Cheese',
		required: [true, 'Item reference is required'],
	},
	amount: {
		type: Number,
		required: [true, 'Amount is required'],
		min: [0.01, 'Minimum amount is $0.01'],
	},
	status: {
		type: String,
		required: true,
		enum: ['pending', 'rejected', 'accepted'],
		default: 'pending',
	},
});

module.exports = mongoose.model('Offer', offerSchema);
