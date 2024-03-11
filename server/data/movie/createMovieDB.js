// let APIACCESSTOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNzM4MjdjN2MxOWRiZTY3NDJlMWVlZmE3YmJkMjE3ZSIsInN1YiI6IjY1NTZiOTM4ZWVhMzRkMDBmZmZhYTA4OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AwFO1aJTFYXxLSuvij2va1CzICbQ0eFgmcR2v4YMdcs'
// let APIKEY = 'e73827c7c19dbe6742e1eefa7bbd217e'
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const apiKey = 'e73827c7c19dbe6742e1eefa7bbd217e';
const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNzM4MjdjN2MxOWRiZTY3NDJlMWVlZmE3YmJkMjE3ZSIsInN1YiI6IjY1NTZiOTM4ZWVhMzRkMDBmZmZhYTA4OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AwFO1aJTFYXxLSuvij2va1CzICbQ0eFgmcR2v4YMdcs';

const movieTitlesPath = path.join(__dirname, 'movieTitles.json');
const outputFilePath = path.join(__dirname, 'movies.json'); 
// Function to read movie titles from a JSON file
function readMovieTitles(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading movie titles:', error);
      return [];
    }
  }

  const movieTitles = readMovieTitles(movieTitlesPath);
async function fetchMovieDetails(title) {
  try {
    // Step 1: Search for the movie by title
    const searchResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`);
    const movies = searchResponse.data.results;
    if (movies.length === 0) {
      throw new Error(`No movies found for title: ${title}`);
    }
    const movieId = movies[0].id; // Assume the first result is the correct movie

    // Step 2: Get the movie's details using the movie endpoint
    const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=videos,credits`);
    const movieDetails = detailsResponse.data;

    // Step 3: Extract the required information
    const movieInfo = {
      title: movieDetails.title,
      genre: movieDetails.genres.map(genre => genre.name),
      year: movieDetails.release_date.split('-')[0],
      cast: movieDetails.credits.cast.map(member => member.name),
      runtime: movieDetails.runtime,
      trailer: movieDetails.videos.results.length > 0 ? `https://www.youtube.com/watch?v=${movieDetails.videos.results[0].key}` : null,
      poster: `https://image.tmdb.org/t/p/original${movieDetails.poster_path}`
    };

    return movieInfo;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

// Function to write movie data to a JSON file
function writeMoviesToFile(movies, filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(movies, null, 2), 'utf8');
      console.log('Movies information has been saved to movies.json');
    } catch (error) {
      console.error('Error writing movies to file:', error);
    }
  }

// Step 4: Loop through the movie titles and construct the JSON document
async function constructMovieJson() {
  const moviesInformation = [];

  for (const title of movieTitles) {
    const movieInfo = await fetchMovieDetails(title);
    if (movieInfo) {
      moviesInformation.push(movieInfo);
    }
  }
  // Write the movies information to a JSON file
  writeMoviesToFile(moviesInformation, outputFilePath);
  // You can write the moviesInformation to a JSON file or do something else with it
  console.log(JSON.stringify(moviesInformation, null, 2));
}

constructMovieJson();
