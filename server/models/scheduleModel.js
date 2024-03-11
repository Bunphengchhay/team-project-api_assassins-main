const mongoose = require('mongoose');

// Define a Mongoose schema
const screeningSchema = new mongoose.Schema({
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater', // Reference to the Theater model
    required: true
  },
  room: {
    type: String,
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie', // Reference to the Movie model
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

// Create a Mongoose model using the schema
// In your code where you define the screeningSchema
screeningSchema.index({ theater: 1, dateTime: 1 });

const Screening = mongoose.model('Screening', screeningSchema);

module.exports = Screening;
