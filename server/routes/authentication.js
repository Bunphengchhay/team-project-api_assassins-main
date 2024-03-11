const express = require('express');
const router = express.Router();
const { client } = require('../db/conn');
const { retrieveCollection } = require('./collectionHelpers');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const collectionName = "User";

/**
 * 
 * @param {string} password 
 * @returns 
 */
function hashPassword(password) {
    return password;
}

router.get('/auth', (req, res) => {
    var result = {
        authenticated: req.session.user ? true : false
    };
    if (result.authenticated) result.user = req.session.user;
    res.status(200).json(result);
});

router.post('/login', async (req, res) => {
    if (req.session.user) {
        res.status(400).json({
            success: false,
            message: "Already logged in."
        });
        return;
    }

    const { email, password } = req.body;

    try {
        const User = retrieveCollection(collectionName);
        const target = await User.findOne({ email: email });

        if (target && await bcrypt.compare(password, target.password)) {
            req.session.user = {
                _id: target._id,
                name: target.name,
                email: target.email,
                member: target.member,
                role: target.roles
            };
            res.status(200).json({
                success: true,
                user: req.session.user
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Email or password incorrect."
            });
        }
    } catch (err) {
        console.error('Error authenticating.', err);
        res.status(500).json({ error: err.message });
    }
});

// router.post('/login', async (req, res) => {{
//     if (req.session.user) {
//         res.status(400).json({
//             success: false,
//             message: "Already logged in."
//         });
//         return;
//     }

//     const password = hashPassword(req.body.password);
//     const email = req.body.email;
//     try {
//         const User = retrieveCollection(collectionName);
//         const target = await User.findOne({ email: email, password_hashed: password });
//         if (target) {
//             req.session.user = {
//                 _id: target._id,
//                 name: target.name,
//                 email: target.email,
//                 role: target.role
//             };
//             res.status(200).json({
//                 success: true,
//                 user: req.session.user
//             });
//         } else {
//             res.status(400).json({
//                 success: false,
//                 message: "Email or password incorrect."
//             });
//         }
//     } catch (err) {
//         console.error('Error authenticating.', err);
//         res.status(500).json({ error: err.message });
//     }
// }})

router.post('/logout', (req, res) => {
    if (!req.session.user) {
        res.status(400).json({
            success: false,
            message: "Not logged in."
        });
        return;
    }

    req.session.destroy();
    res.status(200).json({
        success: true,
        message: "Logout successful."
    });
});

router.post('/register', async (req, res) => {
    if (req.session.user) {
        res.status(400).json({
            success: false,
            message: "Already logged in."
        });
        return;
    }

    const { name, email, phone_number, password } = req.body;
    const password_hashed = await bcrypt.hash(password, 10);

    try {
        const User = retrieveCollection(collectionName);

        if (await User.findOne({ email: email })) {
            res.status(400).json({ message: "An account with the provided email already exists." });
        } else {
            const result = await User.insertOne({
                name: name,
                email: email,
                phone_number: phone_number,
                password: password_hashed, // Store the hashed password
                member: {
                    is_premium: false,
                    reward: 0,
                    payment_info: null
                },
                roles: []
            });

            if (result.acknowledged && result.insertedId) {
                req.session.user = {
                    _id: result.insertedId,
                    name,
                    email,
                    role: []
                };
                res.status(201).json({
                    success: true,
                    user: req.session.user
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Unable to create an account. Try again later."
                });
            }
        }
    } catch (err) {
        console.error('Error creating an account.', err);
        res.status(500).json({ error: err.message });
    }
});


// router.post('/register', async (req, res) => {
//     if (req.session.user) {
//         res.status(400).json({
//             success: false,
//             message: "Already logged in."
//         });
//         return;
//     }

//     const name = req.body.name;
//     const email = req.body.email;
//     const phone_number = req.body.phone_number;
//     const password = hashPassword(req.body.password);

//     try {
//         const User = retrieveCollection(collectionName);
//         if (await User.findOne({ email: email })) {
//             res.status(400).json({ message: "An account with the provided email already exists." });
//         } else {
//             const result = await User.insertOne({
//                 name: name,
//                 email: email,
//                 phone_number: phone_number,
//                 password_hashed: password,
//                 member: {
//                     is_premium: false,
//                     reward: 0,
//                     payment_info: null
//                 },
//                 roles: []
//             });
//             if (result.acknowledged && result.insertedId) {
//                 req.session.user = {
//                     _id: result._id,
//                     name: name.name,
//                     email: email.email,
//                     role: []
//                 };
//                 res.status(201).json({
//                     success: true,
//                     user: req.session.user
//                 });
//             } else {
//                 res.status(500).json({
//                     success: false,
//                     message: "Unable to create an account. Try again later."
//                 });
//             }
//         }
//     } catch (err) {
//         console.error('Error creating an account.', err);
//         res.status(500).json({ error: err.message });
//     }
// });

module.exports = router;
