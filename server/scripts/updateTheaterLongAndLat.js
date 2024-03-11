require('dotenv').config();
const { client, connectToMongo } = require('../db/conn')
const GOOGLE_API_KEY = "AIzaSyB1eaA8Oni7KK62XtXsRgf1RPwZjb7j8Cs"
const fetch = require('node-fetch'); // Make sure to install node-fetch
const uri = process.env.MONGODB_URI; // Ensure this is in your .env file or set in your environment

const DB_NAME = 'APIAssassins'; // Replace with your actual database name
const COLLECTION_NAME = 'Theater'; // Replace with your actual collection name


async function createGeoSpatialIndex(){

  try{
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db(DB_NAME);
    // Create the 2dsphere index on 'address.coordinates'
    try {
      await db.collection(COLLECTION_NAME).createIndex({ 'address.coordinates': '2dsphere' });
      console.log('2dsphere index created successfully');
    } catch (indexError) {
      console.error('Error creating 2dsphere index:', indexError);
    } 
  }catch(error){
    console.log(error)
  }finally{
    await client.close();
    console.log("connection closed")
  }
}
// createGeoSpatialIndex().catch(console.error);


// Function to geocode an address using the Google Maps API
async function geocodeAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url, { credentials: 'include' });
  const data = await response.json();

  if (data.status === 'OK') {
    const location = data.results[0].geometry.location;
    return [location.lng, location.lat]; // Return as [longitude, latitude]
  } else {
    throw new Error(`Geocoding failed for the address: ${address} with status: ${data.status}`);
  }
}

async function addGeospatialDataToTheaters() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const cursor = collection.find({});

    while (await cursor.hasNext()) {
      const theater = await cursor.next();
      const addressString = `${theater.address.street}, ${theater.address.city}, ${theater.address.state}, ${theater.address.zipcode}`;

      try {
        const [lng, lat] = await geocodeAddress(addressString);

        await collection.updateOne(
          { _id: theater._id },
          {
            $set: {
              'address.coordinates': {
                type: 'Point',
                coordinates: [lng, lat] // Set the coordinates as plain numbers
              }
            }
          }
        );
        console.log(`Updated theater with ID ${theater._id}`);
      } catch (error) {
        console.error(`Failed to update theater with ID ${theater._id}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error adding geospatial data to theaters:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// addGeospatialDataToTheaters().catch(console.error);


async function removeTheaterCoordinates() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Update all theaters to remove the address.coordinates field
    const result = await collection.updateMany(
      {}, // This empty query object matches all documents
      {
        $unset: { 'address.coordinates': "" } // Remove the entire coordinates field
      }
    );

    console.log(`Removed address.coordinates from ${result.modifiedCount} theaters.`);

  } catch (error) {
    console.error('Error removing address.coordinates field:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// removeTheaterCoordinates().catch(console.error);



// require('dotenv').config();
// // const Theater = require('../models/theaterModelv2'); // Replace with the path to your model file
// const { client, connectToMongo } = require('../db/conn')
// const DB_NAME = 'APIAssassins'; // Replace with your actual database name
// const COLLECTION_NAME = 'Theater'; // Replace with your actual collection name

// async function updateTheatersForGeospatial() {
// try {
//   await client.connect();
//   console.log("Connected to MongoDB");

//   const db = client.db(DB_NAME);
//   const collection = db.collection(COLLECTION_NAME);

//   // Fetch all theaters that have a latitude and longitude
//   const theaters = await collection.find({
//     'address.latitude': { $exists: true },
//     'address.longitude': { $exists: true }
//   }).toArray();

//   const bulkOps = theaters.map(theater => {
//     return {
//       updateOne: {
//         filter: { _id: theater._id },
//         update: {
//           $set: {
//             'address.coordinates': {
//               type: 'Point',
//               coordinates: [
//                 theater.address.longitude, // Ensure longitude is first
//                 theater.address.latitude  // Latitude is second
//               ]
//             }
//           },
//           $unset: {
//             'address.latitude': "", // Remove latitude
//             'address.longitude': "" // Remove longitude
//           }
//         }
//       }
//     };
//   });

//   // Perform the bulk write operation
//   if (bulkOps.length > 0) {
//     const result = await collection.bulkWrite(bulkOps);
//     console.log(`Updated ${result.modifiedCount} theaters.`);
//   } else {
//     console.log("No theaters to update.");
//   }

// } catch (error) {
//   console.error('Error updating theaters for geospatial indexing:', error);
// } finally {
//   await client.close();
//   console.log('Disconnected from MongoDB');
// }
// }

// updateTheatersForGeospatial().catch(console.error);


// // easy to get current address 
// require('dotenv').config();
// const { client, connectToMongo } = require('../db/conn');
// // import fetch from 'node-fetch';
// const fetch = require('node-fetch'); // Make sure to install the node-fetch package or an equivalent.
// const API_KEY = "AIzaSyB1eaA8Oni7KK62XtXsRgf1RPwZjb7j8Cs"

// async function geocodeAddress(address) {
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
//     const response = await fetch(url);
//     const data = await response.json();
  
//     if (data.status === 'OK') {
//       const location = data.results[0].geometry.location;
//       return { latitude: location.lat, longitude: location.lng };
//     } else {
//       throw new Error(`Geocoding failed for the address: ${address} with status: ${data.status}`);
//     }
//   }
  
//   async function updateTheaterGeocodes() {
//     try {
//       await client.connect();
//     //   // Check if we're connected to MongoDB before proceeding
//       if (client.topology.isConnected()) {
//         console.log("Connected to mongodb is open");
//         const database = client.db('APIAssassins'); // Replace with your actual database name.
//         const theaters = database.collection('Theater');
  
//         const cursor = theaters.find({});
  
//         while (await cursor.hasNext()) {
//           const theater = await cursor.next();
//           const address = `${theater.address.street}, ${theater.address.city}, ${theater.address.state}, ${theater.address.zipcode}`;
  
//           try {
//             const { latitude, longitude } = await geocodeAddress(address);
            
//             await theaters.updateOne(
//               { _id: theater._id },
//               { $set: { 'address.latitude': latitude, 'address.longitude': longitude } }
//             );
            
//             console.log(`Theater ${theater.name} updated with latitude: ${latitude} and longitude: ${longitude}.`);
//           } catch (error) {
//             console.error(`Failed to update theater ${theater.name}:`, error.message);
//           }
//         }
//       } else {
//         console.error("Could not establish a database connection");
//       }
//     } catch (error) {
//       console.error('Failed to update theater geocodes:', error);
//     } finally {
//       client.close();
//       console.log("Connection to MongoDB is closed.");
//     }
//   }
  
//   updateTheaterGeocodes();