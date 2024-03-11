// insertTheaters.ts
// import axios from 'axios';
//import theatersData from '../data/theaters/theaterInfo'; // Import your theater data
//import theaterInfo from '../data/theaters/theaterInfo.json'; // Import your theater data
// console.log(theaterInfo);

// import axios from "axios";

// // console.log(theaterInfo.length)
// const conn = require('../db/conn.js'); // Assuming you have established a MongoDB connection
// import * as theaterInfo from '../data/theaters/theaterInfo.json'
// const apiUrl = 'http://localhost:5003/theaterRoutes'


// async function insertTheaters() {
//   try {
//     for (const theaterData of theaterInfo) {
//       // Send a POST request to add each theater
//       const response = await axios.post(`${apiUrl}/add`, theaterData);
//       console.log(`Response from server:`, response.data);
//       console.log(`Theater added: ${theaterData.name}`);
//     }

//     console.log('All theaters added successfully.');
//   } catch (error) {
//     console.error('Error adding data to MongoDB:', error);
//   }
// }

// insertTheaters();
// require('dotenv').config();
// import axios from 'axios';
// const { client, connectToMongo } = require('../db/conn.js') // Assuming correct relative path

// const theaterInfo = require('../data/theaters/theaterInfo.json'); // If you prefer, you can use import syntax for JSON

// const apiUrl = 'http://localhost:5003/theaterRoutes';

// async function insertTheaters() {
//   try {
//     // Establish the MongoDB connection
//     await connectToMongo();

//     for (const theaterData of theaterInfo) {
//       // Send a POST request to add each theater
//       const response = await axios.post(`${apiUrl}/add`, theaterData);
//       console.log(`Response from server:`, response.data);
//       console.log(`Theater added: ${theaterData.name}`);
//     }

//     console.log('All theaters added successfully.');
//   } catch (error) {
//     console.error('Error adding data to MongoDB:', error);
//   } finally {
//     // Close the MongoDB connection when done
//     await client.close();
//   }
// }

// insertTheaters();
//require('dotenv').config();

//import dotenv from 'dotenv'
//dotenv.config({path: '../.env'})
//dotenv.config()
const { client, connectToMongo } = require('../db/conn.js') // Assuming correct relative path
import axios from 'axios';
import { MongoClient } from 'mongodb'; // Import MongoClient from the 'mongodb' package

const uri = process.env.ATLAS_URI; // Retrieve the MongoDB connection URI from environment variables
const theaterInfo = require('../data/theaters/theaterInfo.json');
const apiUrl = 'http://localhost:5003/theaterRoutes';

async function insertTheaters() {

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('APIAssassins'); // Replace 'your-database-name' with your actual database name
    const collection = database.collection('Theater'); // Replace 'your-collection-name' with your actual collection name

    for (const theaterData of theaterInfo) {
      // Send a POST request to add each theater
      const response = await axios.post(`${apiUrl}/add`, theaterData);
      console.log(`Response from server:`, response.data);
      console.log(`Theater added: ${theaterData.name}`);

      // Insert the data into your MongoDB collection
      await collection.insertOne(theaterData);
    }

    console.log('All theaters added successfully.');
  } catch (error) {
    console.error('Error adding data to MongoDB:', error);
  } finally {
    // Close the MongoDB connection when done
    await client.close();
  }
}

insertTheaters();


