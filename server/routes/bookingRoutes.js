const express = require('express');
const router = express.Router();
const { retrieveCollection, hasEmployeePrivilege, hasAdminPrivilege } = require('./collectionHelpers');
const { ObjectId } = require('mongodb');
require('../typedef/types');

const collectionName = 'Booking'

// GET: Get all items from 'Booking' collection, with optional expected query
// route: /bookings?
router.get('/bookings', async (req, res) => {
  try {
      var filter = {};
      if (req.query.buyerId) filter.buyerId = new ObjectId(req.query.buyerId);
      if (req.query.minDate || req.query.maxDate) {
        let dateFilter = {};
        if (req.query.minDate) dateFilter.$gte = new Date(req.query.minDate);
        if (req.query.maxDate) dateFilter.$lte = new Date(req.query.maxDate);
        filter.purchaseDateTime = dateFilter;
      }
      if (req.query.movieId) filter['movieScreening.movie'] = new ObjectId(req.query.movieId);
      if (req.query.theaterId) filter.theater = new ObjectId(req.query.theaterId);
      // retrieve from collection
      const collection = retrieveCollection(collectionName);
      /** @type {WithId<Booking>[]} */
      const bookingData = await collection.find(filter).toArray();
      res.status(200).json({
          count: bookingData.length,
          bookings: bookingData
      });
  } catch (err) {
      console.error('Error fetching data from MongoDB:', err);
      res.status(500).json({ error: err.message });
  }
});

router.get('/bookings/:id', async (req, res) => {
  try {
      const collection = retrieveCollection(collectionName);
      /** @type {WithId<Booking>} */
      const booking = await collection.findOne({ _id: new ObjectId(req.params.id) });
      res.status(200).json(booking);
  } catch (err) {
      console.error('Error fetching data from MongoDB:', err);
      res.status(500).json({ error: err.message });
  }
});

router.get('/bookings-user/:id', async (req, res) => {
  try {
    const collection = retrieveCollection(collectionName);
    const userId = req.params.id;

    // Try searching by ObjectId
    const pipeline = [
      {
        $match: { buyerId: new ObjectId(userId) }
      }
      // Add any additional pipeline stages if needed
    ];

    const userBookings = await collection.aggregate(pipeline).toArray();

    // If no results are found, try searching by string-based buyerId
    if (userBookings.length === 0) {
      const stringBasedUserBookings = await collection
        .find({ buyerId: userId })
        .toArray();

      // If still no results, return false
      if (stringBasedUserBookings.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, bookings: stringBasedUserBookings });
    }

    return res.status(200).json({ success: true, bookings: userBookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});



// POST: Add users to the "Users" collection
router.post('/bookings', async (req, res) => {
  try {
    // DO NOT USE THIS TO ADD NEW BOOKINGS. THIS IS AN ADMIN COMMAND.
    if (!req.session.user) {
      res.status(401).json({ success: false, message: 'Please login in.' });
      return;
    } else if (!hasEmployeePrivilege(req.session.user.role)) {
      res.status(401).json({ success: false, message: 'Admin privilege required.' });
      return;
    }
  
    const collection = retrieveCollection(collectionName);
    /** @type {Booking[]} */
    const bookingDataArray = req.body;
    const result = await collection.insertMany(bookingDataArray, { timeout: 30000 }); // Set the timeout to 30 seconds
    if (result.acknowledged) {
        if (result.insertedCount > 0) res.status(201).json({ success: true, message: 'Request acknowledged.', response: result });
        else res.status(200).json({ success: true, message: 'Request acknowledged.', response: result });
    } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
  } catch (err) {
    console.error('Error adding data to MongoDB:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update user in the "Users" collection
router.put('/bookings/:id', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({ success: false, message: 'Please login in.' });
      return;
    } else if (!hasEmployeePrivilege(req.session.user.role)) {
      res.status(401).json({ success: false, message: 'Admin privilege required.' });
      return;
    }
    
    const collection = retrieveCollection(collectionName);
    /** @type {Booking} */
    const booking = req.body;
    const result = await collection.replaceOne({ _id: new ObjectId(req.params.id) }, booking, { timeout: 30000 });
    if (result.acknowledged) {
        if (result.modifiedCount > 0) res.status(200).json({ success: true, message: 'Request acknowledged.', response: result });
        else res.status(404).json({ success: false, message: 'Not found.', response: result });
    } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
  } catch (err) {
    console.error('Error adding data to MongoDB:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update booking status to "refund" by ID
router.put('/bookings/refund/:id', async (req, res) => {
  try {
    const collection = retrieveCollection(collectionName);
    const bookingId = req.params.id;
    
    // Check if the booking exists
    const existingBooking = await collection.findOne({ _id: new ObjectId(bookingId) });
    if (!existingBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Check if the booking status is already "refunded"
    if (existingBooking.status === 'refunded') {
      return res.status(200).json({ success: true, message: 'Booking is already refunded.' });
    }

    // Update the booking status to "refunded"
    const result = await collection.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { status: 'refunded' } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ success: true, message: 'Booking status updated to refund.' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update booking status.' });
    }
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ error: err.message });
  }
});



// DELETE: delete booking by id
router.delete('/bookings/:id', async (req, res) => {
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
      console.error('Error deleting booking from MongoDB:', err);
      res.status(500).json({ error: err.message });
  }
});

// POST: Create a new booking for a user with the given ID
// POST: Create a temporary booking (reservation)
// route: /booking/temporary
router.post('/bookings/temporary', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: 'Please log in.' });
    }

    const { userId } = req.session.user;
    const collection = retrieveCollection(collectionName);
    const reservationData = req.body;

    // Check if a booking with the same date, movieId, and seat already exists
    const existingBooking = await collection.findOne({
      'purchaseDateTime': reservationData.purchaseDateTime,
      'moviePass.movieScreening': reservationData.moviePass.movieScreening,
      'moviePass.tickets.assignedSeat': reservationData.moviePass.tickets[0].assignedSeat,
    });

    if (existingBooking) {
      return res.status(409).json({ success: false, message: 'Seat is already booked.' });
    }

    // Add a timestamp to the reservation data
    reservationData.timestamp = new Date(); // Current timestamp

    // Insert the reservation into the 'Booking' collection
    const result = await collection.insertOne(reservationData);

    if (result.acknowledged) {
      // Add the reservation ID to the user's session cart
      if (!req.session.cart) {
        req.session.cart = [];
      }
      req.session.cart.push(result.insertedId);

      // Set a timeout to remove the booking after a certain time (e.g., 10 minutes)
      const removalTimeout = 10 * 60 * 1000; // 10 minutes in milliseconds
      setTimeout(async () => {
        // Remove the booking if it's still in the cart
        if (req.session.cart.includes(result.insertedId)) {
          req.session.cart = req.session.cart.filter((id) => id !== result.insertedId);
          // Also, remove the booking from the database
          await collection.deleteOne({ _id: result.insertedId });
        }
      }, removalTimeout);

      res.status(201).json({
        success: true,
        message: 'Reservation created successfully',
        reservationId: result.insertedId,
      });
    } else {
      res.status(500).json({ success: false, message: 'Failed to create reservation.' });
    }
  } catch (err) {
    console.error('Error creating a temporary booking:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to fetch booked seats for a given movie screening
router.get('/bookings-seat-with-scheduleID', async (req, res) => {
  try {
      // Extract schedule ID from query parameters
      const scheduleId = req.query.scheduleId;
      if (!scheduleId) {
          return res.status(400).json({ error: 'Schedule ID is required' });
      }

      const collection = retrieveCollection(collectionName);

      const bookingsWithMovieScreening = await collection.find({
          "moviePass.movieScreening": scheduleId,
          "moviePass.movieScreening": { $exists: true }
      }).toArray();

      if (bookingsWithMovieScreening.length === 0) {
          res.json({ message: "No bookings with the specified schedule ID found." });
      } else {
          res.json({ bookings: bookingsWithMovieScreening });
      }
  } catch (err) {
      console.error('Error querying MongoDB', err);
      res.status(500).json({ error: err.message });
  }
});

// query with remove duplicate seat
router.get('/bookings-seat', async (req, res) => {
  try {
      // Extract schedule ID from query parameters
      const scheduleId = req.query.scheduleId;
      if (!scheduleId) {
          return res.status(400).json({ error: 'Schedule ID is required' });
      }

      const collection = retrieveCollection(collectionName);

      const bookingsWithMovieScreening = await collection.find({
          "moviePass.movieScreening": scheduleId,
          "moviePass.movieScreening": { $exists: true }
      }).toArray();

      if (bookingsWithMovieScreening.length === 0) {
          res.json({ message: "No bookings with the specified schedule ID found." });
      } else {
          // Extract assignedSeat values from the bookings
          const assignedSeats = bookingsWithMovieScreening.map(
              booking => booking.moviePass.tickets.map(ticket => ticket.assignedSeat)
          ).flat();

          // Remove duplicates using a Set
          const uniqueAssignedSeats = [...new Set(assignedSeats)];

          res.json({ assignedSeats: uniqueAssignedSeats });
      }
  } catch (err) {
      console.error('Error querying MongoDB', err);
      res.status(500).json({ error: err.message });
  }
});

// const { ObjectId } = require('mongodb');
router.put('/bookings-payment', async (req, res) => {
  try {
    // Extract the data from the request body
    const { reservationId, account, securityCode } = req.body;

    // Retrieve the bookings collection
    const collection = retrieveCollection(collectionName); // Replace with your collection name

    // Check if the document with the given reservationId exists
    const existingDocument = await collection.findOne({ _id: new ObjectId(reservationId) });

    if (existingDocument) {
      // console.log('Existing Document:', existingDocument);

      // Update the existing document with the correct field paths
      const result = await collection.updateOne(
        { _id: new ObjectId(reservationId) },
        {
          $set: {
            'payment_info.account': account,
            'payment_info.security_code_hashed': securityCode,
            'status': 'settled',
          }
        }
      );

      // Check if the update was successful
      if (result.matchedCount === 1) {
        console.log('Payment information updated successfully');
        return res.status(200).json({ message: 'Payment information updated successfully' });
      } else {
        console.error('Booking not updated');
        return res.status(500).json({ error: 'Booking not updated' });
      }
    } else {
      console.error('Booking not found');
      return res.status(404).json({ error: 'Booking not found' });
    }
  } catch (err) {
    console.error('Error updating booking in MongoDB:', err);
    res.status(500).json({ error: err.message });
  }
});

// router.put('/bookings-payment', async (req, res) => {
//   try {
//     // Extract the data from the request body
//     const { reservationId, account, securityCode } = req.body;

//     // Retrieve the bookings collection
//     const collection = retrieveCollection('bookings'); // Replace with your collection name

//     // Check if the document with the given reservationId exists
//     const existingDocument = await collection.findOne({ _id: new ObjectId(reservationId) });

//     if (existingDocument) {
//       // Update the existing document with the correct field paths
//       const result = await collection.updateOne(
//         { _id: new ObjectId(reservationId) },
//         {
//           $set: {
//             'payment_info.account': account,
//             'payment_info.security_code_hashed': securityCode,
//             'status': 'settled',
//           }
//         }
//       );

//       // Check if the update was successful
//       if (result.matchedCount === 1) {
//         console.log('Payment information updated successfully');
//         return res.status(200).json({ message: 'Payment information updated successfully' });
//       } else {
//         console.error('Booking not updated');
//         return res.status(500).json({ error: 'Booking not updated' });
//       }
//     } else {
//       console.error('Booking not found');
//       return res.status(404).json({ error: 'Booking not found' });
//     }
//   } catch (err) {
//     console.error('Error updating booking in MongoDB:', err);
//     res.status(500).json({ error: err.message });
//   }
// });






// router.put('/bookings-payment', async (req, res) => {
//   try {
//     // Add any debugging or testing logic here
//     console.log(req.body);
    
//     // Return a JSON response with a message
//     return res.status(200).json({ message: 'Payment information updated successfully' });
//   } catch (err) {
//     console.error('Error updating booking in MongoDB:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
	