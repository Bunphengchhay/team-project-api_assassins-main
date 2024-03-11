const express = require('express');
const router = express.Router();
const { WithId, ObjectId } = require('mongodb');
const { retrieveCollection, hasEmployeePrivilege, hasAdminPrivilege } = require('./collectionHelpers');

// database and collection names
const collectionName = 'ScheduleDetailedView';
const baseCollectionName = 'Schedule';

// GET: Get all items from 'Movie' collection, with optional expected query
// route: /schedule
router.get('/schedule', async (req, res) => {
    try {
        var filter = {};
        // retrieve from collection
        const collection = retrieveCollection(collectionName);
        const scheduleData = await collection.find(filter).toArray();
        res.status(200).json({
            count: scheduleData.length,
            movies: scheduleData
        });
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/schedule/:id', async (req, res) => {
    try {
        const collection = retrieveCollection(collectionName);
        const schedule = await collection.findOne({ _id: new ObjectId(req.params.id) });
        res.status(200).json(schedule);
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/schedule', async (req, res) => {
    try {
        if (!req.session.user) {
          res.status(401).json({ success: false, message: 'Please login in.' });
          return;
        } else if (!hasEmployeePrivilege(req.session.user.role)) {
          res.status(401).json({ success: false, message: 'Admin privilege required.' });
          return;
        }
    
        const collection = retrieveCollection(baseCollectionName);
        const scheduleDataArray = req.body;
        const result = await collection.insertMany(scheduleDataArray, { timeout: 30000 });
        if (result.acknowledged) {
            if (result.insertedCount > 0) res.status(201).json({ success: true, message: 'Request acknowledged.', response: result });
            else res.status(200).json({ success: true, message: 'Request acknowledged.', response: result });
        } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
    } catch (err) {
        console.error('Error adding data to MongoDB', err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/schedule/:id', async (req, res) => {
    try {
        if (!req.session.user) {
          res.status(401).json({ success: false, message: 'Please login in.' });
          return;
        } else if (!hasEmployeePrivilege(req.session.user.role)) {
          res.status(401).json({ success: false, message: 'Admin privilege required.' });
          return;
        }
    
        const collection = retrieveCollection(baseCollectionName);
        const schedule = req.body;
        const result = await collection.replaceOne({ _id: new ObjectId(req.params.id) }, schedule, { timeout: 30000 });
        if (result.acknowledged) {
            if (result.modifiedCount > 0) res.status(200).json({ success: true, message: 'Request acknowledged.', response: result });
            else res.status(404).json({ success: false, message: 'Not found.', response: result });
        } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
    } catch (err) {
        console.error('Error updating data to MongoDB', err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/schedule/:id', async (req, res) => {
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
        console.error('Error deleting schedule from MongoDB:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;