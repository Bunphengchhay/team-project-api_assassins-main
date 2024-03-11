require('dotenv').config();
// Import the MongoDB client and connection function
const { client, connectToMongo } = require('../db/conn');
const { Collection, Document } = require('mongodb');
require('../typedef/tmdb');
require('../typedef/types');

const dbName = 'APIAssassins';
const collectionName = "Movie"

const apiKey = '6b101e50a1260c7409749df78cca4e13'
const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjEwMWU1MGExMjYwYzc0MDk3NDlkZjc4Y2NhNGUxMyIsInN1YiI6IjY1MzYwOTI4YWJkYWZjMDBlYjhjZGM3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YRuc4uISfBmtzNVmXr6A1VUmiTEZHpFuqKpnoQDMcRQ'
const url = 'https://api.themoviedb.org/3';
const options = {
    method: 'GET',
    credentials: 'include',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
    }
};
const image_url = 'https://image.tmdb.org/t/p/original'
const yt_url = 'https://youtu.be'
const pages = 5;

/**
 * Checks the movie collection if the specified movie already exists
 * @param {DBMovie} movie 
 * @param {Collection<Document>} collection 
 * @returns whether the movie is already in the collection.
 */
async function collectionHasData(movie, collection) {
    try {
        if (await collection.findOne({ title: movie.title })) {
            console.log(`Duplicate document with title = ${movie.title} already exists, will be updated.`);
            return true;
        } else return false;
    } catch (err) {
        console.error('Error:', err);
        return false;
    }
}

/**
 * Pulls movies from The Movie DB and - after processing them - uploads them to the database.
 */
async function insertMoviesIntoDatabase()
{
    try {
        let connected = await connectToMongo();
        if (!connected) return;
        console.log("Connected to MongoDB");

        // run a set number of times
        /** @type {DBMovie[]} */ let movies = [];
        for (let page = 1; page <= pages; ++page)
        {
            let discoverResults = await fetch(`${url}/discover/movie?page=${page}`, options).then(res => res.json())
                .then(discovery => (/** @type {TmdbMovieDiscovery} */ (discovery)).results);
            for (let i = 0; i < discoverResults.length; ++i) {
                let movieId = discoverResults[i].id;
                let tmdbMovie = await fetch(`${url}/movie/${movieId}?append_to_response=credits%2Cvideos`, options)
                    .then(res => /** @type {TmdbMovie} */(res.json()));
                let tmdbCredits = tmdbMovie.credits;
                let tmdbTrailers = tmdbMovie.videos.results.filter(x => x.type == 'Trailer' && x.site == 'YouTube');
                movies.push({
                    title: tmdbMovie.title,
                    genre: tmdbMovie.genres.map(x => x.name),
                    year: parseInt(tmdbMovie.release_date.split('-')[0]),
                    cast: tmdbCredits.cast.map(x => x.name),
                    runtime: tmdbMovie.runtime,
                    trailer: tmdbTrailers.length > 0 ? `${yt_url}/${tmdbTrailers[0].key}` : '',
                    poster: `${image_url}${tmdbMovie.poster_path}`
                });
            }
        }

        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        let insertions = 0;
        let duplicates = 0;
        let failures = 0;
        // loops through the movie list, checking them for duplicates
        for (let movie of movies)
        {
            if (await collectionHasData(movie, collection))
            {
                await collection.replaceOne({ title: movie.title }, movie);
                duplicates++;
            }
            else {
                try {
                    await collection.insertOne(movie);
                    console.log(`Document inserted with title = ${movie.title}`);
                    insertions++;
                } catch (error) {
                    console.error('MDB insertion failed:', error);
                    failures++;
                }
            }
        }

        console.log('total updates:', insertions + duplicates + failures);
        console.log('actual insertions:', insertions);
        console.log('duplicates/updates:', duplicates);
        console.log('failures:', failures);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { insertMoviesIntoDatabase };
