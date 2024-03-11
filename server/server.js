// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const { MongoClient, ServerApiVersion } = require('mongodb');

// require('dotenv').config()

// const app = express();
// const port = process.env.PORT || 5002;

// app.use(cors());
// app.use(express.json());


// const mongo_connect = require("./db/conn");
// mongo_connect;

// app.use('/api', require('./routes/api'))


// app.listen(port, () =>{
//   console.log(`Server is running on port: ${port}`);

// })

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000", "https://api-assassins-balancer-2018757611.us-east-1.elb.amazonaws.com"]
}));
app.use(express.json());

// Import the MongoDB client and connection function
const { client, connectToMongo } = require('./db/conn');
const session = require('express-session');
const MongoStore = require('connect-mongo');
// const { insertMoviesIntoDatabase } = require('./scripts/loadMoviesFromTmdb');

// Check MongoDB connection status
async function startServer() {
  try {
    await connectToMongo();
    
    if (client.topology.isConnected()) {
      console.log('Connected to MongoDB');
      // Start the Express server
      app.use(session({
        secret: 'a2o93jfadsv9jspdpbvfdt4',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            client,
            dbName: 'APIAssassins',
            collectionName: 'Session',
            ttl: 6000 // 100 minutes; increase this in production builds
        }),
        cookie: {
          secure: false
        }
      }));
      app.use('/api', require('./routes/authentication'));
      app.use('/api', require('./routes/theaterRoutes'));
      app.use('/api', require('./routes/movieRoutes'));
      app.use('/api', require('./routes/userRoutes'));
      app.use('/api', require('./routes/bookingRoutes'));
      app.use('/api', require('./routes/schedule'));
      // app.use('/api', require('./routes/registerRoutes'));
      // app.use('/api', require('./routes/loginRoutes'));
      app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
      });
    } else {
      console.error('Failed to connect to MongoDB');
    }
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Call the function to check MongoDB connection
startServer();
// insertMoviesIntoDatabase();