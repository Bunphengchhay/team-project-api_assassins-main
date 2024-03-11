const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genres: [
        {
            type: String
        }
    ],
    year: {
        type: Number,
        required: true
    },
    cast: [
        {
            type: String
        }
    ],
    runtime: {
        type: Number,
        required: true
    },
    trailer: {
        type: String
    },
    poster: {
        type: String
    }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
