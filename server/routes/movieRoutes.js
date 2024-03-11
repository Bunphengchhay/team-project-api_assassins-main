const express = require('express');
const router = express.Router();
const { WithId, ObjectId } = require('mongodb');
const { retrieveCollection, hasEmployeePrivilege, hasAdminPrivilege } = require('./collectionHelpers');
require('../typedef/types');

// database and collection names
const collectionName = 'Movie';

// GET: Get all items from 'Movie' collection, with optional expected query
// route: /movies?q=&genre=&minYear=&maxYear=
router.get('/movies', async (req, res) => {
    try {
        // get query, genre, and year query entries, if any
        var filter = {};
        if (req.query.q) filter.title = new RegExp(req.query.q, 'i');
        if (req.query.genre) filter.genre = new RegExp(req.query.genre, 'i');
        if (req.query.minYear || req.query.maxYear) {
            filter.year = {};
            if (req.query.minYear) filter.year.$gte = parseInt(req.query.minYear);
            if (req.query.maxYear) filter.year.$lte = parseInt(req.query.maxYear);
        }
        // retrieve from collection
        const collection = retrieveCollection(collectionName);
        /** @type {WithId<DBMovie>[]} */
        const movieData = await collection.find(filter).toArray();
        res.status(200).json({
            count: movieData.length,
            movies: movieData
        });
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/movies/:id', async (req, res) => {
    try {
        const collection = retrieveCollection(collectionName);
        /** @type {WithId<DBMovie>} */
        const movie = await collection.findOne({ _id: new ObjectId(req.params.id) });
        res.status(200).json(movie);
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST: Add movies to the 'Movie' collection
router.post('/movies', async (req, res) => {
    try {
        if (!req.session.user) {
          res.status(401).json({ success: false, message: 'Please login in.' });
          return;
        } else if (!hasEmployeePrivilege(req.session.user.role)) {
          res.status(401).json({ success: false, message: 'Admin privilege required.' });
          return;
        }
    
        const collection = retrieveCollection(collectionName);
        /** @type {DBMovie[]} */
        const movieDataArray = req.body;
        const result = await collection.insertMany(movieDataArray, { timeout: 30000 });
        if (result.acknowledged) {
            if (result.insertedCount > 0) res.status(201).json({ success: true, message: 'Request acknowledged.', response: result });
            else res.status(200).json({ success: true, message: 'Request acknowledged.', response: result });
        } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
    } catch (err) {
        console.error('Error adding data to MongoDB', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT: Update a movie with the specified ID in the 'Movie' collection
router.put('/movies/:id', async (req, res) => {
    try {
        if (!req.session.user) {
          res.status(401).json({ success: false, message: 'Please login in.' });
          return;
        } else if (!hasEmployeePrivilege(req.session.user.role)) {
          res.status(401).json({ success: false, message: 'Admin privilege required.' });
          return;
        }
    
        const collection = retrieveCollection(collectionName);
        /** @type {DBMovie} */
        const movie = req.body;
        const result = await collection.replaceOne({ _id: new ObjectId(req.params.id) }, movie, { timeout: 30000 });
        if (result.acknowledged) {
            if (result.modifiedCount > 0) res.status(200).json({ success: true, message: 'Request acknowledged.', response: result });
            else res.status(404).json({ success: false, message: 'Not found.', response: result });
        } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
    } catch (err) {
        console.error('Error updating data to MongoDB', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE: delete movie by id
router.delete('/movies/:id', async (req, res) => {
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
        console.error('Error deleting movie from MongoDB:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;