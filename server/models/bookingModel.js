const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
	_id:{
        type: String,
        required: true,
        unique: true,
    },
	buyerId: {
        type: String,
        required: true,
        unique: true,
    },
	purchaseDateTime: {
        type: String,
        required: True,

    },
    movieScreening: {
		movie: {
            type: Movie},
		dateTime: {
            type: Date,

        },
},
theater: {
    type: Theater
},
tickets: [
    {
        assignedSeat: {
            type: String,
        },
        price: {
            type: Number,
        },
},
],
totalPrice: {
    type: Number,
},
payment_info: {
	account: {
        type: String,
    },
	security_code_hashed: {
        type: String
    },
}
}
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = {Booking};
