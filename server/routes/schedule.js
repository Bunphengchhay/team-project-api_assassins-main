const express = require('express');
const router = express.Router();
const { client } = require('../db/conn');
const { retrieveCollection } = require('./collectionHelpers');
const collectionName = 'Schedule'
const collection = retrieveCollection(collectionName)
const {ObjectId } = require('mongodb');
router.get('/schedules', async (req, res) => {
    try {
        // const collection = client.db('APIAssassins').collection('Schedule');
        const schedules = await collection.find({}).toArray(); // Convert cursor to array
        res.json({ schedules });
    } catch (err) {
        console.error('Error fetching data from MongoDB', err);
        res.status(500).json({ error: err.message });
    }
});
router.post('/schedules/insertOne', async (req, res) => {
    try {
    //   const collection = client.db('APIAssassins').collection('Schedule');
      
        // Extract data from the request body
        const { theater, room, movie, dateTime, duration, price } = req.body;
        // Convert the dateTime string to a Date object
        const dateTimeAsDate = new Date(dateTime);
        // Create a new schedule object
        const newSchedule = {
        theater: new ObjectId(theater), // Convert theater to ObjectId
        room,
        movie: new ObjectId(movie), // Convert movie to ObjectId
        dateTime: dateTimeAsDate,
        duration,
        price
        };
  
        // Insert the new schedule into the database
        const result = await collection.insertOne(newSchedule);
    
        res.status(201).json({ message: 'Schedule created successfully', scheduleId: result.insertedId });
    } catch (err) {
      console.error('Error creating schedule:', err);
      res.status(500).json({ error: err.message });
    }
  });
  
  router.delete('/schedules/:id', async (req, res) => {
    try {
      // Extract the schedule ID from the request parameters as a string
      const scheduleIdString = req.params.id;
  
      // Attempt to convert the schedule ID string to ObjectId
      const scheduleId = new ObjectId(scheduleIdString);
  
      // Attempt to delete the schedule with the specified ID
      const result = await collection.deleteOne({ _id: scheduleId });
  
      // Check if a document was deleted (result.deletedCount will be 1) or not found (result.deletedCount will be 0)
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
  
      res.json({ message: 'Schedule deleted successfully' });
    } catch (err) {
      console.error('Error deleting schedule:', err);
      res.status(500).json({ error: err.message });
    }
  });
  
  


module.exports = router;
