require('dotenv').config();
const { client, connectToMongo } = require('../db/conn')
const fs = require('fs');
const path = require('path');

// Construct the full path to the JSON file
const filePath = path.join(__dirname, '..', 'data', 'movie', 'movies.json');
const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
// const dbName = process.env.DB_NAME;
const dbName = 'APIAssassins';
const collectionName = "Movie"; // Use the correct collection name


async function checkForDuplicates(dataToInsert, collection) {
  try {
      const duplicateExists = await collection.findOne({ title: dataToInsert.title });

      if (duplicateExists) {
        console.log(`Duplicate movie with title "${dataToInsert.title}" already exists. Skipping insertion.`);
        return true; // Return true to indicate a duplicate
      } else {
        return false; // Return false to indicate no duplicate
      }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

async function insertMoviesFromFile(client) {
  try {
    const db = client.db(dbName);
    const movieCollection = db.collection(collectionName);
    let successfulInsertions = 0;
    let duplicatedNum = 0;

    for (const data of rawData) {
      const isDuplicate = await checkForDuplicates(data, movieCollection);

      if (!isDuplicate) {
        await movieCollection.insertOne(data);
        console.log(`Document inserted with title "${data.title}"`);
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
