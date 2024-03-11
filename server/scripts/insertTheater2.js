require('dotenv').config();
// Import the MongoDB client and connection function
const { client, connectToMongo } = require('../db/conn')
const fs = require('fs');
const path = require('path');
// Construct the full path to the JSON file
const filePath = path.join(__dirname, '..', 'data', 'theaters', 'theaterv2.json');
const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const dbName = 'APIAssassins';
const collectionNames = "Theater"


async function checkForDuplicates(dataToInsert, collectionName) {
  try {
      const duplicateExists = await collectionName.findOne({ name: dataToInsert.name });

      if (duplicateExists) {
        console.log(`Duplicate document with name "${dataToInsert.name}" already exists. Skipping insertion.`);
        return true; // Return true to indicate a duplicate
      } else {
        return false; // Return false to indicate no duplicate
      }
   
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

async function insertTheatersFromFile(client) {
  try {
    const db = client.db(dbName);
    const collectionName = db.collection(collectionNames);
    let successfulInsertions = 0;
    let duplicatedNum = 0;
      // Loop through the data and check for duplicates before inserting each document
      for (const data of rawData) {
        const isDuplicate = await checkForDuplicates(data, collectionName);

        if (!isDuplicate) {
          // Insert the data into MongoDB
          const result = await collectionName.insertOne(data);
          console.log(`Document inserted with name "${data.name}"`);
          successfulInsertions++;
        }
        else{
          duplicatedNum++;
        }
      }

      console.log('TotalNumber Inserted ', rawData.length);
      console.log('Successfully added: ', successfulInsertions);
      console.log('Duplicated Number: ', duplicatedNum);

  } catch (error) {
    console.error('Error:', error);
  }
}

async function insertData(){
  try{
    await connectToMongo();
    if(client.topology.isConnected()){
       console.log("Connected to mongodb is open")
       await insertTheatersFromFile(client);
    }
  }catch(error){
    console.error("Could not establish a database connection");
  }finally{
    client.close();
    console.log("Connection to MongoDB is closed.")
  }
}
insertData();

// Call the function to insert data
//insertTheatersFromFile();


// async function checkForDuplicates(dataToInsert) {
//   const dbName = 'APIAssassins';
//   const collectionName = 'Theater';

//   try {
//     // Connect to MongoDB
//     await connectToMongo();

//     if (client.topology.isConnected()) {
//       console.log('Connected to MongoDB');

//       // Get the MongoDB database and collection
//       const db = client.db(dbName);
//       const collection = db.collection(collectionName);

//       // Check for duplicates based on a unique field (e.g., "name")
//       const duplicateExists = await collection.findOne({ name: dataToInsert.name });

//       if (duplicateExists) {
//         console.log(`Duplicate document with name "${dataToInsert.name}" already exists. Skipping insertion.`);
//         return true; // Return true to indicate a duplicate
//       } else {
//         return false; // Return false to indicate no duplicate
//       }
//     } else {
//       console.error('Failed to connect to MongoDB');
//       return false;
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     return false;
//   } finally {
//     // Close the MongoDB connection when done
//     client.close();
//   }
// }

// async function insertTheatersFromFile() {
//   try {
//     // Connect to MongoDB
//     await connectToMongo();
    
//     if (client.topology.isConnected()) {
//       console.log('Connected to MongoDB');
//       const dbName = 'APIAssassins';
//       const collectionName = "Theater"
//       const db = client.db(dbName);
//       const collection = db.collection(collectionName)

//       let successfulInsertions = 0;

//       // Loop through the data and check for duplicates before inserting each document
//       for (const data of rawData) {
//         const isDuplicate = await checkForDuplicates(data);

//         if (!isDuplicate) {
//           // Insert the data into MongoDB
//           const result = await collection.insertOne(data);
//           console.log(`Document inserted with name "${data.name}"`);
//           successfulInsertions++;
//         }
//       }
//       console.log(`${result.insertedCount} document(s) inserted`);

//     } else {
//       console.error('Failed to connect to MongoDB');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   } finally {
//     // Close the MongoDB connection when done
//     client.close();
//   }
// }

// // Call the function to insert data
// insertTheatersFromFile();

