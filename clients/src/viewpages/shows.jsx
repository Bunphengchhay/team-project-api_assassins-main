import { useState, useEffect } from "react";
import { useTheaterContext } from "../navigation/TheaterContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MovieCard from "../subpages/moviecard";
import SmallCard from "../subpages/card";

import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
// ... other imports ...

function Shows() {
  const { closestTheaterInfo } = useTheaterContext();
  const [playingVideoIndex, setPlayingVideoIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const subtitle = "American media franchise created by James Cameron, which consists of a planned series of epic science fiction films produced by Lightstorm Entertainment and distributed by 20th Century Studios, as well as associated merchandise, video games and theme park attractions."
  const [uniqueGenres, setUniqueGenres] = useState(['All']);

  useEffect(() => {
    if (closestTheaterInfo?.showtimes) {
      const allGenres = closestTheaterInfo.showtimes.flatMap(showtime => showtime.genre);
      setUniqueGenres(['All', ...new Set(allGenres)]);
    }
  }, [closestTheaterInfo]);
  
  // Function to handle play button click
  const handlePlayClick = (index) => {
    setPlayingVideoIndex(playingVideoIndex === index ? null : index); // Toggle play state for the video
  };
    // Function to extract unique genres
    const getUniqueGenres = () => {
      const allGenres = closestTheaterInfo.showtimes.flatMap(showtime => showtime.genre);
      return ['All', ...new Set(allGenres)];
    };
  
    // const uniqueGenres = getUniqueGenres();
  
    // Function to handle search term input
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value.toLowerCase());
    };
  
    // Function to handle genre change
    const handleGenreChange = (event) => {
      setSelectedGenre(event.target.value);
    };
  
    // Filter function
    const filterShowtimes = (showtime) => {
      const titleMatch = showtime.movieTitle.toLowerCase().includes(searchTerm);
      const genreMatch = showtime.genre.map(g => g.toLowerCase()).includes(searchTerm);
      const genreFilter = selectedGenre === 'All' || showtime.genre.includes(selectedGenre);
      
      return (titleMatch || genreMatch) && genreFilter;
    };
  

  // ... other functions like getStringAfterEquals and extractTime ...

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ borderBottom: '1px solid #FFB43E', display: 'inline-block', padding: '10px 10px' }}>Get Ticket Here</h3>

      <div style={{padding: '10px'}}>
        <input
          type="text"
          placeholder="Search by title or genre..."
          onChange={handleSearchChange}
          style={{ marginRight: '1rem', borderRadius: '10px', borderStyle: 'none'}}
        />
        <select onChange={handleGenreChange}>
          {uniqueGenres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      {/* {closestTheaterInfo ? (
        closestTheaterInfo.showtimes?.map((data, index) => ( */}
       {closestTheaterInfo ? (
        closestTheaterInfo.showtimes.filter(filterShowtimes).map((data, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
            }}
            className="show-card-container"
          >
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {playingVideoIndex !== index && (
                // Poster Image
                <img
                  src={data.poster}
                  alt={`${data.movieTitle} Poster`}
                  style={{
                    width: '200px',
                    height: '300px',
                    objectFit: 'cover',
                  }}
                />
              )}
              {playingVideoIndex === index ? (
                // Iframe for Video
                <iframe
                  width="200"
                  height="300"
                  src={`https://www.youtube.com/embed/${getStringAfterEquals(
                    data.trailer
                  )}?autoplay=1&mute=0`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={data.movieTitle}
                  style={{
                    zIndex: 1,
                  }}
                />
              ) : (
                // Play Icon
                <FontAwesomeIcon
                  icon={faPlayCircle}
                  onClick={() => handlePlayClick(index)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                    fontSize: '3rem',
                    color: 'white',
                    cursor: 'pointer',
                    opacity: 0.7,
                  }}
                />
              )}
            </div>

            {/* MovieCard component */}
            <MovieCard
              movie={{
                title: data.movieTitle || '',
                subtitle: subtitle,
                genre: data.genre.join('|') || '',
                time: extractTime(data.dateTime) || '',
              }}
            />
          </div>
        ))
      ) : (
        <p>Loading ....</p>
      )}
    </div>
  );
}

export default Shows;


function getStringAfterEquals(inputString) {
  if (inputString.includes("youtu.be")) {
    const indexOfEquals = inputString.lastIndexOf('/');
    if (indexOfEquals !== -1) {
      return inputString.substring(indexOfEquals + 1);
    } else {
      return null; // Return null if there is no '/' character in the input string
    }
  } else if (inputString.includes("youtube.com")) {  
    const indexOfEquals = inputString.indexOf('=');
    if (indexOfEquals !== -1) {
      return inputString.substring(indexOfEquals + 1);
    } else {
      return null; // Return null if there is no '=' character in the input string
    }
  } else {
    return null;
  }
}

function extractTime(datetimeString) {
  const datetimePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z$/;
  const match = datetimeString.match(datetimePattern);

  if (match) {
    const [, year, month, day, hours, minutes] = match;
    let hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    let ampm = "AM";

    if (hour >= 12) {
      if (hour > 12) {
        hour -= 12;
      }
      ampm = "PM";
    }

    return `${hour}:${minute} ${ampm}`;
  } else {
    return null; // Return null if the input string doesn't match the expected format
  }
}



// function Shows() {
//   const { closestTheaterInfo } = useTheaterContext();
//   const [showTime, setShowTime] = useState(null);
//   const subtitle = "American media franchise created by James Cameron, which consists of a planned series of epic science fiction films produced by Lightstorm Entertainment and distributed by 20th Century Studios, as well as associated merchandise, video games and theme park attractions."
//     // New state to track if the video is playing
//     const [isVideoPlaying, setIsVideoPlaying] = useState(false);

//     // Function to toggle video play state
//     const toggleVideoPlay = () => {
//       setIsVideoPlaying(!isVideoPlaying);
//     };
//      // State to manage the index of the playing video
//   const [playingVideoIndex, setPlayingVideoIndex] = useState(null);

//   // ... other existing code ...

//   // Handler to play video for a specific index
//   const playVideo = (index) => {
//     // Set the index of the video that should be playing
//     setPlayingVideoIndex(index);
//   };
//     return (
//       <div style={{ textAlign: 'center' }}>
  
//   {closestTheaterInfo ? (
//         closestTheaterInfo.showtimes?.map((data, index) => (
//           <div
//             key={index}
//             style={{
//               position: 'relative',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               padding: '2rem',
//             }}
//             className="show-card-container"
//           >
//             {/* Container for the poster and play icon */}
//             <div style={{ position: 'relative', display: 'inline-block' }}>
//               <img
//                 src={data.poster}
//                 alt="Movie Poster"
//                 style={{
//                   width: '200px',
//                   height: '300px',
//                   objectFit: 'cover',
//                 }}
//               />
//               {/* Play Icon */}
//               <FontAwesomeIcon
//                 icon={faPlayCircle}
//                 onClick={() => playVideo(index)}
//                 style={{
//                   position: 'absolute',
//                   top: '50%',
//                   left: '50%',
//                   transform: 'translate(-50%, -50%)',
//                   zIndex: 2,
//                   fontSize: '3rem', // Adjust icon size as needed
//                   color: 'white', // Adjust icon color as needed
//                   cursor: 'pointer', // Change cursor to pointer on hover
//                   opacity: 0.7, // Make the icon slightly transparent
//                 }}
//               />
//             </div>
  
//               {/* MovieCard */}
//               <MovieCard
//                 movie={{
//                   title: data.movieTitle || '',
//                   subtitle: subtitle,
//                   genre: data.genre.join('|') || [],
//                   time: extractTime(data.dateTime) || '',
//                 }}
//               />
//             </div>
//           ))
//         ) : (
//           <p>No Show</p>
//         )}
  
//       </div>
//     );
//   }
  
//   export default Shows;



// import React, { useEffect } from 'react';
// import '../styles/show.css';
// import sawX from '../assets/image/sawx.jpg';
// import avatar from '../assets/image/avatar.jpeg';
// import mermaid from '../assets/image/mermaid.jpeg';
// import war1917 from '../assets/image/war1917.jpg';
// import MovieCard from '../subpages/moviecard';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
// import { useState } from 'react';
// import { useTheaterContext } from '../navigation/TheaterContext';
// import SmallCard from '../subpages/card';

// // Dummy data array
// const movies = [
//   {
//     id: 1,
//     title: 'Saw X',
//     subtitle: 'Set between the events of SAW I and II, a sick and desperate John travels to Mexico for a risky and experimental medical procedure in hopes of a miracle cure for his cancer – only to discover the entire operation is a scam to defraud the most vulnerable.',
//     rating: 'PG-13',
//     genre: 'Thriller, Horror, Action',
//     showtimes: ['2:00 pm', '4:30 pm', '7:00 pm', '9:30 pm'],
//     image: sawX,
//     trailer: 'QIEe3qsJZUQ',
//     date: [
//       '12/5',
//       '12/6',
//       '12/7',
//       '12/8',
//       '12/9',
//       '12/10',
//       '12/11',
//       '12/12',
//       '12/13',
//       '12/14',
//     ]
//   },
//   {
//     id: 2,
//     title: 'Avatar',
//     subtitle: 'Jake Sully (Sam Worthington), a paralyzed former Marine, becomes mobile again through one such Avatar and falls in love with a Na vi woman (Zoe Saldana). As a bond with her grows, he is drawn into a battle for the survival of her world.',
//     rating: 'PG',
//     genre: 'Family, Fantasy, Musical',
//     showtimes: ['1:00 pm', '3:30 pm', '6:00 pm', '8:30 pm'],
//     image: avatar,
//     trailer: 'd9MyW72ELq0',
//     date: [
//       '12/5',
//       '12/6',
//       '12/7',
//       '12/8',
//       '12/9',
//       '12/10',
//       '12/11',
//       '12/12',
//       '12/13',
//       '12/14',
//     ]

//   },
//   {
//     id: 3,
//     title: 'Little Mermaid',
//     subtitle: 'The plot follows the mermaid princess Ariel, who is fascinated with the human world; after saving Prince Eric from a shipwreck, she makes a deal with the sea witch Ursula to walk on land.',
//     rating: 'PG',
//     genre: 'Family, Fantasy, Musical',
//     showtimes: ['1:00 pm', '3:30 pm', '6:00 pm', '8:30 pm'],
//     image: mermaid,
//     trailer: 'kpGo2_d3oYE',
//     date: [
//       '12/5',
//       '12/6',
//       '12/7',
//       '12/8',
//       '12/9',
//       '12/10',
//       '12/11',
//       '12/12',
//       '12/13',
//       '12/14',
//     ]
//   },
//   {
//     id: 4,
//     title: '1917',
//     subtitle: 'At a time when it seems as if cinema experiences a new technological breakthrough every few months, it is oddly comforting that moviegoers can still be hooked by a film that is presented as being one unbroken shot. ',
//     rating: 'PG',
//     genre: 'Family, Fantasy, Musical',
//     showtimes: ['1:00 pm', '3:30 pm', '6:00 pm', '8:30 pm'],
//     image: war1917,
//     trailer: 'YqNYrYUiMfg',
//     date: [
//       '12/5',
//       '12/6',
//       '12/7',
//       '12/8',
//       '12/9',
//       '12/10',
//       '12/11',
//       '12/12',
//       '12/13',
//       '12/14',
//     ]
//   },
//   // ... more movies
// ];

// const dates = [
//   '12/5',
//   '12/6',
//   '12/7',
//   '12/8',
//   '12/9',
//   '12/10',
//   '12/11',
//   '12/12',
//   '12/13',
//   '12/14',
// ];

// function getStringAfterEquals(inputString) {
//   const indexOfEquals = inputString.indexOf('=');
//   if (indexOfEquals !== -1) {
//     return inputString.slice(indexOfEquals + 1);
//   } else {
//     return null; // Return null or another value to indicate that no '=' was found.
//   }
// }
// function Show() {
//   const [currentShow, setCurrentShow] = useState(null);
//   const [playingTrailerId, setPlayingTrailerId] = useState(null);
//   const [genre, setGenre] = useState(null);
//   const [activeFilters, setActiveFilters] = useState({
//     nowPlaying: true,
//     genre: '',
//     XD: false,
//     Regular: false,
//   });
//   const [searchQuery, setSearchQuery] = useState('');

//   const { closestTheaterInfo } = useTheaterContext();

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value.toLowerCase());
//   };
//   function extractedMovieInfo(showtimes) {
//     return showtimes.map((show) => ({
//       movieTitle: show.movieTitle,
//       genre: show.genre.join(', '), // Join genre array into a comma-separated string
//       dateTime: new Date(show.dateTime), // Convert dateTime string to a Date object
//     }));
//   }

//   const toggleFilter = (filter) => {
//     setActiveFilters((prevFilters) => ({ ...prevFilters, [filter]: !prevFilters[filter] }));
//   };

//   useEffect(() => {
//     try {
//       async function getMovie() {
//         const curShow = await extractedMovieInfo(closestTheaterInfo);
//         setCurrentShow(curShow);
//         console.log(closestTheaterInfo);
//       }
//       getMovie();
//     } catch (err) {
//       console.log("There is no show", err);
//     }
//   }, []);


//   const playTrailer = (movieId) => {
//     setPlayingTrailerId(movieId);
//   };

//   // Apply both filters and search to the movies list
//   // const filteredMovies = movies.filter((movie) => {
//   //   // Apply 'Now Playing' filter
//   //   if (activeFilters.nowPlaying && movie.showtimes.length === 0) {
//   //     return false;
//   //   }
//   //   // Apply 'Genre' filter
//   //   if (activeFilters.genre && movie.genre.toLowerCase().indexOf(activeFilters.genre.toLowerCase()) === -1) {
//   //     return false;
//   //   }
//   //   // Apply 'XD' filter
//   //   if (activeFilters.XD && movie.genre.toLowerCase().indexOf('xd') === -1) {
//   //     return false;
//   //   }
//   //   // Apply search query
//   //   if (
//   //     searchQuery &&
//   //     !movie.title.toLowerCase().includes(searchQuery) &&
//   //     !movie.genre.toLowerCase().includes(searchQuery)
//   //   ) {
//   //     return false;
//   //   }
//   //   // If none of the above conditions matched, the movie is included in the filter
//   //   return true;
//   // });

//   const filterMovie = (data, activeFilters, searchQuery) => {
//     return data.filter((item) => {
//       // Apply 'Now Playing' filter
//       if (activeFilters.nowPlaying && item.showtimes.length === 0) {
//         return false;
//       }
//       // Apply 'Genre' filter
//       if (
//         activeFilters.genre &&
//         item.genre.toLowerCase().indexOf(activeFilters.genre.toLowerCase()) === -1
//       ) {
//         return false;
//       }
//       // Apply 'XD' filter
//       if (activeFilters.XD && item.genre.toLowerCase().indexOf('xd') === -1) {
//         return false;
//       }
//       // Apply search query
//       if (
//         searchQuery &&
//         (!item.title.toLowerCase().includes(searchQuery) &&
//           !item.genre.toLowerCase().includes(searchQuery))
//       ) {
//         return false;
//       }
//       // If none of the above conditions matched, the item is included in the filter
//       return true;
//     });
//   };
//   const filterData = (data, filters) => {
//     return data.filter((item) => {
//       // Apply filters based on user selections
//       if (
//         (filters.nowPlaying && item.showtimes.length === 0) ||
//         (filters.genre && item.genre.toLowerCase() !== filters.genre.toLowerCase()) ||
//         (filters.XD && !item.genre.toLowerCase().includes('xd'))
//       ) {
//         return false;
//       }
//       return true;
//     });
//   };

//   const filteredMovies = filterData(movies, activeFilters);

//   const filteredShowtimes = filterData(
//     closestTheaterInfo.showtimes || [],
//     activeFilters
//   );
  
  

//   const allGenre = () => {
//     if (closestTheaterInfo.showtimes !== null) {
//       // Use map to extract genres from each show
//       const genresArray = closestTheaterInfo.showtimes.map((show) => show.genre);
      
//       // Flatten the array of arrays into a single array
//       const allGenres = [].concat(...genresArray);
      
//       // Use a Set to remove duplicates
//       const uniqueGenres = [...new Set(allGenres)];
  
//       return uniqueGenres;
//     }
//     return [];
//   }
  
//   useEffect(()=>{
//     setActiveFilters(allGenre)
//   },[])

//   const test = () => {
//     setActiveFilters(allGenre)
//     console.log(activeFilters);
//   };

//   return (
//     <div className="show-container">
//       <button onClick={test}> </button>
//       <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <h3 style={{ color: 'white' }}>Get Tickets Here</h3>
//         <div style={{ width: '200px', height: '2px', backgroundColor: '#FFB43E', marginBottom: '5px' }}></div>
//       </div>
//       <br />
//       {/* <button onClick={test()}>test</button> */}
//       <div className="show-date">
//         <p> Date: </p>
//         {dates.map((date, index) => (
//           <div key={index} className="date-item">
//             <p>{date}</p>
//           </div>
//         ))}
//       </div>
//       <br />

//       <div className='show-filter-search'>
//         <div className='show-search'>
//           <button onClick={() => toggleFilter('nowPlaying')} className={activeFilters.nowPlaying ? 'active' : ''}>
//             Now Playing
//           </button>
//           {/* <select onChange={(e) => setActiveFilters({ ...activeFilters, genre: e.target.value })} value={activeFilters.genre} className='show-filter'>
//             <option value=''>All Genres</option>
//             <option value='Thriller'>Thriller</option>
//             <option value='Family'>Family</option>
//             <option value='Fantasy'>Fantasy</option>
//           </select> */}
//           <select
//             onChange={(e) =>
//               setActiveFilters({ ...activeFilters, genre: e.target.value })
//             }
//             value={activeFilters.genre}
//             className="show-filter"
//           >
//             <option value="">All Genres</option>
//             {Array.isArray(activeFilters) ? (
//               activeFilters.map((data, index) => (
//                 <option key={index} value={data}>
//                   {data}
//                 </option>
//               ))
//             ) : (
//               <>
//                 <option value="Thriller">Thriller</option>
//                 <option value="Family">Family</option>
//                 <option value="Fantasy">Fantasy</option>
//               </>
//             )}
//           </select>


//           <button onClick={() => toggleFilter('XD')} className={activeFilters.XD ? 'active' : ''}>
//             XD
//           </button>
//           <button onClick={() => toggleFilter('Regular')} className={activeFilters.Regular ? 'active' : ''}>
//             Regular
//           </button>
//         </div>

//         <div className='show-search-bar'>
//           <input
//             type='text'
//             placeholder='Search movies...'
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className='search-input'
//           />
//         </div>
//       </div>
//       <br />
//       {filteredMovies.map((movie) => (
//         <div key={movie.id} className="show-inner-container">
//           {/* Render movie details */}
//         </div>
//       ))}

//       {/* Render filtered showtimes */}
//       {/* {filteredShowtimes.map((data, index) => (
//         <div key={index} className="show-inner-container">
          
//         </div>
//       ))} */}

//       {/* {closestTheaterInfo ? (
//   filterMovie(closestTheaterInfo.showtimes, activeFilters, searchQuery).map((data, index) => (
//     <div key={index} className='show-inner-container'>
//       {playingTrailerId === data.id ? (
//         <iframe
//           width="200"
//           height="300"
//           src={`https://www.youtube.com/embed/${getStringAfterEquals(data.trailer)}?autoplay=1&mute=1`}
//           allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//           title={data.movieTitle}
//         />
//       ) : (
//         <div className="movie-poster-container" onClick={() => playTrailer(data.id)}>
//           <img src={data.poster} alt={data.movieTitle} className="movie-poster" />
//           <FontAwesomeIcon icon={faPlayCircle} className="play-icon" />
//         </div>
//       )}

//       <MovieCard
//         key={index}
//         movie={{
//           title: data.movieTitle,
//           genre: data.genre.join("|"),
//           time: extractTime(data.dateTime),
//         }}
//       />
//     </div>
//   ))
// ) : null} */}

// {/* 
//       {closestTheaterInfo ? (
//         closestTheaterInfo.showtimes?.map((data, index) => (
//      <div key={index} className='show-inner-container'>
//       {playingTrailerId === data.id ? (
//         <iframe
//           width="200"
//           height="300"
//           src={`https://www.youtube.com/embed/${getStringAfterEquals(data.trailer)}?autoplay=1&mute=1`}
//           allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//           title={data.movieTitle}
//         />
//       ) : (
//         <div className="movie-poster-container" onClick={() => playTrailer(data.id)}>
//           <img src={data.poster} alt={data.movieTitle} className="movie-poster" />
//           <FontAwesomeIcon icon={faPlayCircle} className="play-icon" />
//         </div>
//       )}

//       <MovieCard
//         key={index}
//         movie={{
//           title: data.movieTitle,
//           genre: data.genre.join("|"),
//           time: extractTime(data.dateTime),
//         }}
//       />
//     </div>
//   ))
// ) : (
//   filteredMovies.map((movie) => (
//     <div key={movie.id} className='show-inner-container'>
//       {playingTrailerId === movie.id ? (
//         <iframe
//           width="200"
//           height="300"
//           src={`https://www.youtube.com/embed/${movie.trailer}?autoplay=1&mute=1`}
//           allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//           title={movie.title}
//         />
//       ) : (
//         <div className="movie-poster-container" onClick={() => playTrailer(movie.id)}>
//           <img src={movie.image} alt={movie.title} className="movie-poster" />
//           <FontAwesomeIcon icon={faPlayCircle} className="play-icon" />
//         </div>
//       )}
//       <MovieCard movie={movie} />
//     </div>
//   ))
// )} */}


//         {/* <div>
//     {closestTheaterInfo ? (
//       closestTheaterInfo.showtimes?.map((data, index) => (
//         <div key={index} className='show-inner-container'>
//           {playingTrailerId === data.id ? (
//             <iframe
//               width="200"
//               height="300"
//               src={`https://www.youtube.com/embed/${getStringAfterEquals(data.trailer)}?autoplay=1&mute=1`}
//               allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               title={data.movieTitle}
//             />
//           ) : (
//             <div className="movie-poster-container" onClick={() => playTrailer(data.id)}>
//               <img src={data.poster} alt={data.movieTitle} className="movie-poster" />
//               <FontAwesomeIcon icon={faPlayCircle} className="play-icon" />
//             </div>
//           )}

//           <MovieCard
//             key={index}
//             movie={{
//               title: data.movieTitle,
//               genre: data.genre.join("|"),
//               time: extractTime(data.dateTime),
//             }}
//           />
//         </div>
//       ))
//     ) : (
//       filteredMovies.map((movie) => (
//         <div key={movie.id} className='show-inner-container'>
//           {playingTrailerId === movie.id ? (
//             <iframe
//               width="200"
//               height="300"
//               src={`https://www.youtube.com/embed/${movie.trailer}?autoplay=1&mute=1`}
//               allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               title={movie.title}
//             />
//           ) : (
//             <div className="movie-poster-container" onClick={() => playTrailer(movie.id)}>
//               <img src={movie.image} alt={movie.title} className="movie-poster" />
//               <FontAwesomeIcon icon={faPlayCircle} className="play-icon" />
//             </div>
//           )}
//           <MovieCard movie={movie} />
//         </div>
//       ))
//     )}
//   </div> */}

//     </div>
//   );
// }
// export default Show;
