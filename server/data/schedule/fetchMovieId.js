require('dotenv').config();
const { client, connectToMongo } = require('../../db/conn');
const fs = require('fs');
const path = require('path');

const outputFilePath = path.join(__dirname, 'movieId.json'); // Path to the output file
const dbName = 'APIAssassins';
const collectionName = "Movie";

async function fetchAllMovieIdsAndRuntime() {
  try {
    await connectToMongo();
    if (client.topology.isConnected()) {
      console.log("Connected to MongoDB");

      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // Fetch all documents but only include the _id and runtime fields
      const query = {}; // An empty query matches all documents
      const options = { projection: { _id: 1, runtime: 1 } };

      const cursor = await collection.find(query, options);
      const movieData = await cursor.toArray();

      // Map the results to include both the movie ID and runtime
      const movieList = movieData.map(movie => ({
        movieId: movie._id.toString(), // Convert ObjectId to string
        runtime: movie.runtime // Include runtime
      }));

      // Write the results to a JSON file
      fs.writeFileSync(outputFilePath, JSON.stringify(movieList, null, 2), 'utf8');
      console.log(`Movie data has been saved to ${outputFilePath}`);
    }
  } catch (error) {
    console.error("Error fetching movie data:", error);
  } finally {
    await client.close();
    console.log("Connection to MongoDB is closed.");
  }
}

fetchAllMovieIdsAndRuntime();


// require('dotenv').config();
// // Import the MongoDB client and connection function
// const { client, connectToMongo } = require('../../db/conn')
// const fs = require('fs');
// const path = require('path');
// const outputFilePath = path.join(__dirname, 'movieId.json'); // Path to the output file
// const dbName = 'APIAssassins';
// const collectionName = "Movie"

// async function fetchAllMovieIds(){
//   try{
//     await connectToMongo();
//     if(client.topology.isConnected()){
//       console.log("Connected to mongodb is open")

//       const db = client.db(dbName);
//       const collection = db.collection(collectionName);

//       // Fetch all documents but only include the _id field
//       const query = {}; // An empty query matches all documents
//       const options = { projection: { _id: 1 } }; // Include only the _id field

//       const movieIdsCursor = await collection.find(query, options);
//       const movieIds = await movieIdsCursor.toArray();

//       // Extract the _id values and convert them to strings
//       const idList = movieIds.map(movie => movie._id.toString());

//       // Write the _id values to a JSON file
//       fs.writeFileSync(outputFilePath, JSON.stringify(idList, null, 2), 'utf8');
//       console.log(`Movie IDs have been saved to ${outputFilePath}`);
//     }
//   }catch(error){
//     console.error("Could not establish a database connection");
//   }finally{
//     client.close();
//     console.log("Connection to MongoDB is closed.")
//   }
// }

// fetchAllMovieIds();
