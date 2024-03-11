require('dotenv').config();
// Import the MongoDB client and connection function
const { client, connectToMongo } = require('../db/conn')
const fs = require('fs');
const path = require('path');
// Construct the full path to the JSON file
const filePath = path.join(__dirname, '..', 'data', 'bookings', 'bookingInfo.json');
const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const dbName = 'APIAssassins';
const collectionNames = "Booking"


async function checkForDuplicates(dataToInsert, collectionName) {
  try {
      // const duplicateExists = await collectionName.findOne({ name: dataToInsert.name});
      const duplicateExists = await collectionName.findOne({ name: dataToInsert._id});

      if (duplicateExists) {
        console.log(`Duplicate document with id "${dataToInsert._id}" already exists. Skipping insertion.`);
        return true; // Return true to indicate a duplicate
      } else {
        return false; // Return false to indicate no duplicate
      }
   
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

async function insertBookingsFromFile(client) {
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
          // console.log(`Document inserted with name "${data.name}"`);
          console.log(`Document inserted with id "${data._id}"`);
          successfulInsertions++;
        }
        else{
          duplicatedNum++;
        }
      }

      console.log('TotalNumberIsert ', rawData.length);
      console.log('Successfully add: ', successfulInsertions);
      console.log('Duplicate Number: ', duplicatedNum);

  } catch (error) {
    console.error('Error:', error);
  }
}

async function insertData(){
  try{
    await connectToMongo();
    if(client.topology.isConnected()){
       console.log("Connected to mongodb is open")
       await insertBookingsFromFile(client);
    }
  }catch(error){
    console.error("Could not establish a database connection");
  }finally{
    client.close();
    console.log("Connection to MongoDB is closed.")
  }
}
insertData();