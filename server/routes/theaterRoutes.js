const express = require('express');
const router = express.Router();
const { WithId, ObjectId } = require('mongodb');
const { retrieveCollection, hasEmployeePrivilege, hasAdminPrivilege } = require('./collectionHelpers');
require('../typedef/types');

const collectionName = 'Theater';

// GET: Get all items from the "Theater" collection
// route: /theaters?q=&street=&city=&state=&zipcode=
router.get('/theaters', async (req, res) => {
  try {
    var filter = {};
    if (req.query.q) filter.name = new RegExp(req.query.q, 'i');
    if (req.query.street) filter['address.street'] = new RegExp(req.query.street, 'i');
    if (req.query.city) filter['address.city'] = new RegExp(req.query.city, 'i');
    if (req.query.state) filter['address.state'] = new RegExp(req.query.state, 'i');
    if (req.query.zipcode) filter['address.zipcode'] = new RegExp(req.query.zipcode, 'i');
    
    const collection = retrieveCollection(collectionName);
    /** @type {WithId<DBTheater>[]} */
    const theaterData = await collection.find(filter).toArray();

    res.status(200).json({
      count: theaterData.length,
      theaters: theaterData
    });
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/theaters/:id', async (req, res) => {
  try {
    const collection = retrieveCollection(collectionName);
    /** @type {WithId<DBTheater>} */
    const theater = await collection.findOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json(theater);
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST: Add theaters to the "Theater" collection
router.post('/theaters', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({ success: false, message: 'Please login in.' });
      return;
    } else if (!hasEmployeePrivilege(req.session.user.role)) {
      res.status(401).json({ success: false, message: 'Admin privilege required.' });
      return;
    }
  
    const collection = retrieveCollection(collectionName);
    /** @type {DBTheater[]} */
    const theaterDataArray = req.body;
    const result = await collection.insertMany(theaterDataArray, { timeout: 30000 }); // Set the timeout to 30 seconds
    if (result.acknowledged) {
        if (result.insertedCount > 0) res.status(201).json({ success: true, message: 'Request acknowledged.', response: result });
        else res.status(200).json({ success: true, message: 'Request acknowledged.', response: result });
    } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
  } catch (err) {
    console.error('Error adding data to MongoDB:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update theater in the "Theater" collection
router.put('/theaters/:id', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({ success: false, message: 'Please login in.' });
      return;
    } else if (!hasEmployeePrivilege(req.session.user.role)) {
      res.status(401).json({ success: false, message: 'Admin privilege required.' });
      return;
    }
  
    const collection = retrieveCollection(collectionName);
    /** @type {DBTheater} */
    const theater = req.body;
    const result = await collection.replaceOne({ _id: new ObjectId(req.params.id) }, theater, { timeout: 30000 });
    if (result.acknowledged) {
        if (result.modifiedCount > 0) res.status(200).json({ success: true, message: 'Request acknowledged.', response: result });
        else res.status(404).json({ success: false, message: 'Not found.', response: result });
    } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
  } catch (err) {
    console.error('Error adding data to MongoDB:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE: delete theatre by id
router.delete('/theaters/:id', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({ success: false, message: 'Please login in.' });
      return;
    } else if (!hasAdminPrivilege(req.session.user.role)) {
      res.status(401).json({ success: false, message: 'Admin privilege required.' });
      return;
    }
  
    const collection = retrieveCollection(collectionName);
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.acknowledged) {
        if (result.deletedCount > 0) res.status(200).json({ success: true, message: 'Request acknowledged.', response: result });
        else res.status(404).json({ success: false, message: 'Not found.', response: result });
    } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
  } catch (err) {
    console.error('Error deleting theater from MongoDB:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/closest-theater', async (req, res) => {
  const userLat = parseFloat(req.query.lat);
  const userLng = parseFloat(req.query.lng);

  if (!userLat || !userLng) {
    return res.status(400).send('Latitude and longitude are required.');
  }

  try {
    // Perform geospatial query to find the nearest theater
    const collection = retrieveCollection(collectionName);
    const theaters = await collection.find({
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [userLng, userLat] // longitude first, then latitude
          }
        }
      }
    }).limit(1);  // Limiting the result to 1 theater

    // Since $near returns an ordered list, we can take the first one
    const closestTheater = await theaters.next(); // Get the first theater from the cursor

    if (!closestTheater) {
      // If no theaters are found, return a default message or a default theater
      return res.status(404).json({ message: "No theaters found." });
    }

    // Send the response back to the client
    res.json({
      userLocation: { lat: userLat, lng: userLng },
      closestTheater: {
        name: closestTheater.name,
        location: closestTheater.address.coordinates,
        address: closestTheater.address // Include the full address
      }
    });
  } catch (error) {
    console.error('Error finding the closest theater:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Define the API route to get theater information with movie details
router.get('/theaters-with-movies', async (req, res) => {
  const Booking = retrieveCollection('Booking');
  const Theater = retrieveCollection('Theater');
  const Schedule = retrieveCollection('Schedule');
  const Movie = retrieveCollection('Movie');

  try {
    const resultBooking = await Booking.find({}).toArray();
    const resultTheater = await Theater.find({}).toArray();
    const resultSchedule = await Schedule.find({}).toArray();
    const resultMovie = await Movie.find({}).toArray();

    let theaterInfo = resultTheater.map(theater => {
      let theaterSchedules = resultSchedule.filter(schedule => schedule.theater.toString() === theater._id.toString());

      let movies = theaterSchedules.map(schedule => {
        let movie = resultMovie.find(movie => movie._id.toString() === schedule.movie.toString());
        let movieBookings = resultBooking.filter(booking => booking.moviePass && booking.moviePass.movieScreening.toString() === schedule._id.toString());

        let bookedSeats = movieBookings.reduce((acc, booking) => acc + booking.moviePass.tickets.length, 0);

        return movie ? {
          movieTitle: movie.title,
          bookedSeats: bookedSeats
        } : null;
      }).filter(movie => movie); // Filter out null entries

      let totalSeatCapacity = theater.rooms.reduce((acc, room) => {
        let seatCount = 0;
        if (room.seat_count && typeof room.seat_count === 'object' && room.seat_count.$numberInt) {
          seatCount = parseInt(room.seat_count.$numberInt, 10);
        } else if (typeof room.seat_count === 'string') {
          seatCount = parseInt(room.seat_count, 10);
        } else if (typeof room.seat_count === 'number') {
          seatCount = room.seat_count;
        }
        if (isNaN(seatCount)) {
          seatCount = 0;
        }
        return acc + seatCount;
      }, 0);

      let rooms = theater.rooms.map(room => {
        let seatCount = 0;
        if (room.seat_count && typeof room.seat_count === 'object' && room.seat_count.$numberInt) {
          seatCount = parseInt(room.seat_count.$numberInt, 10);
        } else if (typeof room.seat_count === 'string') {
          seatCount = parseInt(room.seat_count, 10);
        } else if (typeof room.seat_count === 'number') {
          seatCount = room.seat_count;
        }
        if (isNaN(seatCount)) {
          seatCount = 0;
        }
        return {
          roomName: room.name,
          numberOfSeats: seatCount
        };
      });

      return {
        theaterName: theater.name,
        movies: movies,
        occupancy: {
          totalSeatCapacity: totalSeatCapacity,
          rooms: rooms
        }
      };
    });

    res.status(200).json(theaterInfo);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// router.get('/theaters-with-movies', async (req, res) => {
//   const Booking = retrieveCollection('Booking')
//   const Theater = retrieveCollection('Theater')
//   const Schedule = retrieveCollection('Schedule')
//   const Movie = retrieveCollection('Movie')

//   try {
//     const resultBooking = await Booking.find({}).toArray()
//     const resultTheater = await Theater.find({}).toArray()
//     const resultSchedule = await Schedule.find({}).toArray()
//     const resultMovie = await Movie.find({}).toArray()

//     let theaterInfo = resultTheater.map(theater => {
//       let schedules = resultSchedule.filter(schedule => schedule.theater === theater._id)
//       let movies = schedules.map(schedule => {
//         let movie = resultMovie.find(movie => movie._id === schedule.movie)
//         let bookings = resultBooking.filter(booking => booking.moviePass.movieScreening === schedule._id)
//         let totalBookedSeats = bookings.reduce((acc, booking) => acc + booking.moviePass.tickets.length, 0)

//         return {
//           movieId: movie._id,
//           totalBookedSeats: totalBookedSeats
//         }
//       })

//       return {
//         theaterId: theater._id,
//         theaterName: theater.name,
//         movies: movies,
//         totalSeatCount: theater.rooms.reduce((acc, room) => {
//           let seatCount = 0;
        
//           // Check if seat_count is an object with $numberInt property
//           if (room.seat_count && typeof room.seat_count === 'object' && room.seat_count.$numberInt) {
//             seatCount = parseInt(room.seat_count.$numberInt, 10);
//           } 
//           // If seat_count is a string
//           else if (typeof room.seat_count === 'string') {
//             seatCount = parseInt(room.seat_count, 10);
//           }
//           // If seat_count is already a number
//           else if (typeof room.seat_count === 'number') {
//             seatCount = room.seat_count;
//           }
        
//           // Add a check for NaN
//           if (isNaN(seatCount)) {
//             seatCount = 0;
//           }
        
//           return acc + seatCount;
//         }, 0)
        
        
//       }
//     })

//     res.status(200).json(theaterInfo);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



module.exports = router;