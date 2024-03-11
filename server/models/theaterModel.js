const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    //required: true,
  },
  address: {
    street: {
      type: String,
      // required: true,
    },
    city: {
      type: String,
     // required: true,
    },
    state: {
      type: String,
     // required: true,
    },
    zipcode: {
      type: String,
     // required: true,
    },
  },
  schedule: [
    {
      room_id: { type: String, required: true },
      feature: { type: String},
      seat_count: { type: Number }, // Assuming at least 1 seat is required
      seat_reserved: [{ type: mongoose.Schema.Types.Mixed }], // This should be defined according to what a reserved seat entails
      price: { type: Number, required: true },
      movie_title: { type: String, required: true },
      date: { type: Date }, // Consider changing to Date type
      time: { type: String }
    },
  ],
});

const Theater = mongoose.model('Theater', theaterSchema);

module.exports = Theater;
