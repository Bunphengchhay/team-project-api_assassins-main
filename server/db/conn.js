// const { MongoClient, ServerApiVersion } = require("mongodb");
// const Db = process.env.ATLAS_URI;
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(Db,  {
//   serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//   }
// }
// );

// async function run() {
//   try {
//     // Connect the client to the server (optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
// module.exports = client;
const { MongoClient, ServerApiVersion } = require('mongodb');
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToMongo() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('Connected to MongoDB');
    return true;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    return false;
  }
}

module.exports = { client, connectToMongo };
