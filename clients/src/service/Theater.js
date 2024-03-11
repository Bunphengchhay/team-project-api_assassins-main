export class Theater {
  constructor(theaterData, schedulesData, moviesData) {
    this.theaterId = theaterData._id;
    this.theaterName = theaterData.name;
    this.address = {
      street: theaterData.address.street,
      city: theaterData.address.city,
      state: theaterData.address.state,
      zipcode: theaterData.address.zipcode,
      coordinates: {
        latitude: theaterData.address.coordinates.coordinates[1],
        longitude: theaterData.address.coordinates.coordinates[0],
      },
    };
    this.theaterRoom = theaterData? theaterData.rooms : "";
    this.movies = this.getMovies(schedulesData, moviesData);
    this.showtimes = this.getShowtimes(schedulesData, moviesData);
  }

  getMovies(schedulesData, moviesData) {
    // Filter schedules for this theater and extract unique movie IDs
    const theaterSchedules = schedulesData.filter(
      (schedule) => schedule.theater === this.theaterId
    );
    const uniqueMovieIds = [...new Set(theaterSchedules.map((schedule) => schedule.movie))];

    // Match movie IDs with movie data to get movie information
    const movies = uniqueMovieIds.map((movieId) => {
      const movieInfo = moviesData.find((movie) => movie._id === movieId);
      return {
        id: movieInfo._id,
        movieTitle: movieInfo ? movieInfo.title : '',
        year: movieInfo? movieInfo.year : "",
        // trailer: movieInfo? movieInfo.trailer : "",
        // poster: movieInfo? movieInfo.poster : "",
        // genre: movieInfo? movieInfo.genre: "",


        // Add other movie properties you need here
      };
    });

    return movies;
  }

  getShowtimes(schedulesData, moviesData) {
    // Filter schedules for this theater and construct showtimes
    const theaterSchedules = schedulesData.filter(
      (schedule) => schedule.theater === this.theaterId
    );
    const showtimes = theaterSchedules.map((schedule) => {
      const movieInfo = moviesData.find((movie) => movie._id === schedule.movie);
      return {
        schedule_id: schedule ? schedule?._id : "",
        movieTitle: movieInfo ? movieInfo.title : '',
        room: schedule.room,
        dateTime: schedule.dateTime,
        duration: movieInfo ? movieInfo.runtime : '',
        price: schedule.price,
        cast: movieInfo ? movieInfo.cast : [],
        trailer: movieInfo? movieInfo.trailer : "",
        poster: movieInfo? movieInfo.poster : "",
        genre: movieInfo? movieInfo.genre: "",
        // Add other showtime properties you need here
      };
    });

    return showtimes;
  }

  getTheaters() {
    return this.theaters;
  }
}


// export class Theater {
//   constructor(theaterData, schedulesData, moviesData) {
//     this.theaterId = theaterData._id;
//     this.theaterName = theaterData.name;
//     this.address = {
//       street: theaterData.address.street,
//       city: theaterData.address.city,
//       state: theaterData.address.state,
//       zipCode: theaterData.address.zipcode,
//       coordinates: {
//         latitude: theaterData.address.coordinates.coordinates[1],
//         longitude: theaterData.address.coordinates.coordinates[0],
//       },
//     };
//     this.movies = this.getMovies(theaterData, schedulesData, moviesData);
//     // this.showtimes = this.getShowtimes(theaterData, schedulesData, moviesData);
//   }

//   getMovies(theaterData, schedulesData, moviesData) {
  
//       // Filter schedules for this theater and extract unique movie titles
//       const theaterSchedules = schedulesData.filter(
//         (schedule) => schedule.theater === this.theaterId
//       );
//       const uniqueMovieTitles = [
//         ...new Set(theaterSchedules.map((schedule) => schedule.movieTitle)),
//       ];

//       // Extract movie information for unique movie titles
//       const movies = uniqueMovieTitles.map((movieTitle) => {
//       const movieInfo = moviesData.find((movie) => movie.title === movieTitle);

//         return {
//           movieTitle: movieTitle? movieTitle : "",
//           genre: movieInfo.genre? movieInfo.genre : "",
//           year: movieInfo.year? movieInfo.year : "",
//           cast: movieInfo.cast? movieInfo.cast : [],
//           runtime: movieInfo.runtime? movieInfo.runtime : "",
//           trailer: movieInfo.trailer? movieInfo.trailer : "",
//           poster: movieInfo.poster? movieInfo.poster : ""
//         };

//       });

//       return movies;
//   }

//   getShowtimes(theaterData, schedulesData, moviesData) {
//     try{  
//     // Filter schedules for this theater and construct showtimes
//       const theaterSchedules = schedulesData.filter(
//         (schedule) => schedule.theater === this.theaterId
//       );
//       const showtimes = theaterSchedules.map((schedule) => {
//         const movieInfo = moviesData.find(
//           (movie) => movie.title === schedule.movieTitle
//         );
//         return {
//           movieTitle: schedule.movieTitle,
//           dateTime: schedule.dateTime,
//           duration: movieInfo.duration,
//           price: schedule.price,
//           cast: movieInfo.cast,
//           poster: movieInfo.poster,
//           trailer: movieInfo.trailer,
//         };
//       });

//       return showtimes;
//     }catch(err){
//         return []
//       }
//   }

//   getTheaters() {
//     return this.theaters;
//   }


// }