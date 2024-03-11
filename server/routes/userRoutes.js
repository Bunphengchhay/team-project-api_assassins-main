const express = require('express');
const router = express.Router();
const { WithId, ObjectId } = require('mongodb');
const User = require('../models/userModel'); // Import your User model
const { retrieveCollection, hasEmployeePrivilege, hasAdminPrivilege } = require('./collectionHelpers');
const bcrypt = require('bcrypt')
require('../typedef/types');

// Define the database and collection names
const collectionName = 'User';
const viewName = 'UserView';

// GET: Get all items from the "Users" collection
// route: /users?q=&email=&phoneNumber=&isPremium=&minReward=&maxReward=
router.get('/users', async (req, res) => {
  // this one is more restrictive: only employees get the full database, and anyone not logged in can't acess anything at all.
  if (!req.session.user) {
    res.status(401).json({ success: false, message: 'Please log in.' });
    return false;
  }
  try {
    var filter = {}
    if (!hasEmployeePrivilege(req.session.user.role)) filter._id = req.session.user._id; // retrieve only the user if not an employee
    if (req.query.q) filter.name = new RegExp(req.query.q, 'i');
    if (req.query.email) filter.email = new RegExp(req.query.email, 'i');
    if (req.query.phoneNumber) filter.phone_number = new RegExp(req.query.phoneNumber, 'i');
    if (req.query.isPremium) filter['member.is_premium'] = (req.query.isPremium === 'true');
    if (req.query.minReward || req.query.maxReward)
    {
      let rewardFilter = {};
      if (req.query.minReward) rewardFilter.$gte = parseInt(req.query.minReward);
      if (req.query.maxReward) rewardFilter.$lte = parseInt(req.query.maxReward);
      filter['member.reward'] = rewardFilter;
    }
    const collection = retrieveCollection(viewName);
    const userData = (await collection.find(filter).toArray()).map(x => {
      delete x.password;
      if (x.member.payment_info) delete x.member.payment_info.security_code_hashed;
      return x;
    });
    res.status(200).json({
      count: userData.length,
      users: userData
    });
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).json({ error: err.message });
  }
});

// module.exports = router;

// well not right. because a user credential should be allowed to query their own info
router.get('/users/:id', async (req, res) => {
  try {
    // this one is more restrictive: only employees can access anyone, and anyone not logged in can't acess anything at all.
    if (!req.session.user) {
      res.status(401).json({ success: false, message: 'Please log in.' });
      return false;
    } else if (!hasEmployeePrivilege(req.session.user.role) && new ObjectId(req.params.id) != req.session.user._id) {
      res.status(401).json({ success: false, message: 'Admin privilege required.' });
      return false;
    }

    const collection = retrieveCollection(viewName);
    var user = await collection.findOne({ _id: new ObjectId(req.params.id) });
    delete user.password;
    if (user.member.payment_info) delete user.member.payment_info.security_code_hashed;
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST: Add users to the "Users" collection
router.post('/users', async (req, res) => {
  try {
    // DO NOT USE THIS TO REGISTER A USER. THIS IS AN ADMIN COMMAND.
    if (!req.session.user) {
      res.status(401).json({ success: false, message: 'Please login in.' });
      return;
    } else if (!hasAdminPrivilege(req.session.user.role)) {
      res.status(401).json({ success: false, message: 'Admin privilege required.' });
      return;
    }

    const collection = retrieveCollection(collectionName);
    /** @type {DBUser[]} */
    const userDataArray = req.body;
    const result = await collection.insertMany(userDataArray, { timeout: 30000 }); // Set the timeout to 30 seconds
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
router.put('/users/:id', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({ success: false, message: 'Please login in.' });
      return;
    } else if (!hasAdminPrivilege(req.session.user.role) && new ObjectId(req.params.id) != req.session.user._id) {
      res.status(401).json({ success: false, message: 'Admin privilege required.' });
      return false;
    }
  
    const collection = retrieveCollection(collectionName);
    /** @type {DBUser} */
    const user = req.body;
    const result = await collection.replaceOne({ _id: new ObjectId(req.params.id) }, user, { timeout: 30000 });
    if (result.acknowledged) {
        if (result.modifiedCount > 0) res.status(200).json({ success: true, message: 'Request acknowledged.', response: result });
        else res.status(404).json({ success: false, message: 'Not found.', response: result });
    } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
  } catch (err) {
    console.error('Error adding data to MongoDB:', err);
    res.status(500).json({ error: err.message });
  }
});

//DELETE: Delete user by id
router.delete('/users/:id', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({ success: false, message: 'Please login in.' });
      return;
    } else if (!hasAdminPrivilege(req.session.user.role)) {
      res.status(401).json({ success: false, message: 'Admin privilege required.' });
      return;
    }
  
    const collection = retrieveCollection(collectionName); // Retrieve your MongoDB collection
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.acknowledged) {
        if (result.deletedCount > 0) res.status(200).json({ success: true, message: 'Request acknowledged.', response: result });
        else res.status(404).json({ success: false, message: 'Not found.', response: result });
    } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
  } catch (err) {
    console.error('Error deleting user from MongoDB:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT: Modify user password (requires verification)
// TODO: when implementing forgot-password reset, consider some way to bypass the password check
router.put('/users/:id/pass', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({ success: false, message: 'Please login in.' });
      return;
    } else if (!hasAdminPrivilege(req.session.user.role) && new ObjectId(req.params.id) != req.session.user._id) {
      res.status(401).json({ success: false, message: 'Admin privilege required.' });
      return false;
    }

    const User = retrieveCollection(collectionName);
    const target = await User.findOne({ _id: new ObjectId(req.params.id) });
    if (target && await bcrypt.compare(req.body.oldPass, target.password)) {
      const password_hashed = await bcrypt.hash(req.body.newPass, 10);
      const result = await User.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { password: password_hashed } });
      if (result.acknowledged) {
        if (result.modifiedCount > 0) res.status(200).json({ success: true, message: 'Password change complete.', response: result });
        else res.status(404).json({ success: false, message: 'Not found.', response: result });
      } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
    } else res.status(403).json({ success: false, message: 'Current password incorrect.' })
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT: update payment method
router.put('/users/:id/payment', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({ success: false, message: 'Please login in.' });
      return;
    } else if (!hasAdminPrivilege(req.session.user.role) && new ObjectId(req.params.id) != req.session.user._id) {
      res.status(401).json({ success: false, message: 'Admin privilege required.' });
      return false;
    }

    var payment_info = req.body;
    if (payment_info) {
      if (!payment_info.account || !payment_info.security_code || !payment_info.account_holder || !payment_info.expiry) {
        res.status(400).json({ success: false, message: 'Invalid payment info data.'});
        return;
      }
      payment_info.security_code_hashed = await bcrypt.hash(payment_info.security_code, 10);
      delete payment_info.security_code;
      payment_info.expiry = new Date(payment_info.expiry);
    }

    const User = retrieveCollection(collectionName);
    const result = await User.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { 'member.payment_info': payment_info } });
    if (result.acknowledged) {
      if (result.modifiedCount > 0) res.status(200).json({ success: true, message: 'Payment change complete.', response: result });
      else res.status(404).json({ success: false, message: 'Not found.', response: result });
    } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
  } catch (err) {
    console.error('Error updating payment:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id/payment', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({ success: false, message: 'Please login in.' });
      return;
    } else if (!hasAdminPrivilege(req.session.user.role) && new ObjectId(req.params.id) != req.session.user._id) {
      res.status(401).json({ success: false, message: 'Admin privilege required.' });
      return false;
    }

    const User = retrieveCollection(collectionName);
    const result = await User.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { 'member.payment_info': null } });
    if (result.acknowledged) {
      if (result.modifiedCount > 0) res.status(200).json({ success: true, message: 'Payment removal complete.', response: result });
      else res.status(404).json({ success: false, message: 'Not found.', response: result });
    } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
  } catch (err) {
    console.error('Error updating payment:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT: change membership status
router.put('/users/:id/membership', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({ success: false, message: 'Please login in.' });
      return;
    } else if (!hasAdminPrivilege(req.session.user.role) && new ObjectId(req.params.id) != req.session.user._id) {
      res.status(401).json({ success: false, message: 'Admin privilege required.' });
      return false;
    }

    const User = retrieveCollection(collectionName);
    // maybe charge payment for membership
    const result = await User.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { 'member.is_premium': req.body.premium } });
    if (result.acknowledged) {
      if (result.modifiedCount > 0) res.status(200).json({ success: true, message: 'Membership change complete.', response: result });
      else res.status(404).json({ success: false, message: 'Not found.', response: result });
    } else res.status(500).json({ success: false, message: 'Request failed.', response: result });
  } catch (err) {
    console.error('Error updating membership:', err);
    res.status(500).json({ error: err.message });
  }
});

// router.get('/closest-theater', async(req, res)=>{
//   const {lat, lng} = req.query
// })

module.exports = router;
