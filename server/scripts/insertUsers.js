"use strict";
// insertTheaters.ts
// import axios from 'axios';
//import theatersData from '../data/theaters/theaterInfo'; // Import your theater data
//import theaterInfo from '../data/theaters/theaterInfo.json'; // Import your theater data
// console.log(theaterInfo);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const { client, connectToMongo } = require('../db/conn.js'); // Assuming correct relative path
const axios_1 = __importDefault(require("axios"));
const uri = process.env.ATLAS_URI; // Retrieve the MongoDB connection URI from environment variables
const userInfo = require('../data/users/userInfo.json');
const apiUrl = 'http://localhost:5003/userRoutes';
function insertUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to the MongoDB server
            yield client.connect();
            console.log('Connected to MongoDB');
            const database = client.db('APIAssassins'); // Replace 'your-database-name' with your actual database name
            const collection = database.collection('User'); // Replace 'your-collection-name' with your actual collection name
            for (const userData of userInfo) {
                // Send a POST request to add each theater
                const response = yield axios_1.default.post(`${apiUrl}/add`, userData);
                console.log(`Response from server:`, response.data);
                console.log(`Theater added: ${userData.name}`);
                // Insert the data into your MongoDB collection
                yield collection.insertOne(userData);
            }
            console.log('All users added successfully.');
        }
        catch (error) {
            console.error('Error adding data to MongoDB:', error);
        }
        finally {
            // Close the MongoDB connection when done
            yield client.close();
        }
    });
}
insertUsers();