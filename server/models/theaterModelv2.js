const mongoose = require('mongoose');

// Define a schema for the room seats
const SeatSchema = new mongoose.Schema({
  row: [String] // Array of strings to represent seat numbers like ["A1", "A2", ...]
});

// Define a schema for the room
const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  seat_count: {
    type: Number,
    required: true
  },
  seats: {
    type: Map,
    of: SeatSchema // Use a map to store rows dynamically
  }
});

// Modify the theater schema to include rooms and geolocation
const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipcode: String,
    coordinates: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
  },
  rooms: [RoomSchema] // Embed the RoomSchema in the TheaterSchema
});

// Create a geospatial index
theaterSchema.index({ 'address.coordinates': '2dsphere' });
const Theater = mongoose.model('Theater', theaterSchema);

module.exports = Theater;


// const mongoose = require('mongoose');

// // Define a schema for the room seats
// const SeatSchema = new mongoose.Schema({
//   row: [String] // Array of strings to represent seat numbers like ["A1", "A2", ...]
// });

// // Define a schema for the room
// const RoomSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   seat_count: {
//     type: Number,
//     required: true
//   },
//   seats: {
//     type: Map,
//     of: SeatSchema // Use a map to store rows dynamically
//   }
// });

// // Modify the theater schema to include rooms
// const theaterSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     //required: true,
//   },
//   address: {
//     street: {
//       type: String,
//       // required: true,
//     },
//     city: {
//       type: String,
//      // required: true,
//     },
//     state: {
//       type: String,
//      // required: true,
//     },
//     zipcode: {
//       type: String,
//      // required: true,
//     },
//   },
//   rooms: [RoomSchema] // Embed the RoomSchema in the TheaterSchema
// });

// const Theater = mongoose.model('Theater', theaterSchema);

// module.exports = Theater;
