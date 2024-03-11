require('dotenv').config();
const { client, connectToMongo } = require('../db/conn')
const fs = require('fs');
const path = require('path');


require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

// Construct the full path to the JSON file
const filePath = path.join(__dirname, '..', 'data', 'schedule', 'schedules.json');
const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const dbName = 'APIAssassins';
const collectionName = "Schedule"; // Use the correct collection name

async function checkForDuplicates(dataToInsert, collection) {
  try {
    // Create a query that checks all fields except for the _id
    let query = {...dataToInsert};
    delete query._id;

    // Check for duplicates in the collection
    const duplicateExists = await collection.findOne(query);

    if (duplicateExists) {
      console.log('Duplicate schedule found. Skipping insertion.');
      return true; // Return true to indicate a duplicate
    } else {
      return false; // Return false to indicate no duplicate
    }
  } catch (error) {
    console.error('Error:', error);
    return true; // Assume true to avoid possible duplication on error
  }
}

// ...

async function insertMoviesFromFile(client) {
    try {
      const db = client.db(dbName);
      const scheduleCollection = db.collection(collectionName);
      let successfulInsertions = 0;
      let duplicatedNum = 0;
  
      for (const data of rawData) {
        // Remove the _id before insertion
        delete data._id;
  
        // Convert theater and movie IDs to DBRefs with correct dbName
        data.theater = {
          "$ref": "Theater",
          "$id": new ObjectId(data.theater),
          "$db": "Theater" // Assuming the theater collection is in the Theater database
        };
  
        data.movie = {
          "$ref": "Movie",
          "$id": new ObjectId(data.movie),
          "$db": "Movie" // Assuming the movie collection is in the Movie database
        };
  
        const isDuplicate = await checkForDuplicates(data, scheduleCollection);
  
        if (!isDuplicate) {
          await scheduleCollection.insertOne(data);
          console.log(`Schedule inserted for movie "${data.movie.$id}"`);
          successfulInsertions++;
        } else {
          duplicatedNum++;
        }
      }
  
      console.log('Total number attempted to insert:', rawData.length);
      console.log('Successfully added:', successfulInsertions);
      console.log('Duplicated number:', duplicatedNum);
  
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  

async function insertData(){
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    await insertMoviesFromFile(client);
  } catch (error) {
    console.error("Could not establish a database connection:", error);
  } finally {
    await client.close();
    console.log("Connection to MongoDB is closed.");
  }
}

insertData();
