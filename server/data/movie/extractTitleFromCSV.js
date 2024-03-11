// const filename =  require('/IMDB-Movie-Data.csv');
const fs = require('fs');
const Papa = require('papaparse');

function extractMovieTitles(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  Papa.parse(fileContent, {
    header: true,
    complete: function(results) {
      const filteredMovies = results.data.filter(movie => parseInt(movie.Year) > 2010);
      const movieTitles = filteredMovies.map(movie => movie.Title).slice(0, 100);

      const movieTitlesJson = JSON.stringify(movieTitles, null, 2);

      // Write the JSON to a file
      fs.writeFileSync('movieTitles.json', movieTitlesJson);
      console.log('Movie titles have been written to movieTitles.json');
    }
  });
}

// Replace 'path/to/your/file.csv' with the actual file path
extractMovieTitles('IMDB-Movie-Data.csv');
