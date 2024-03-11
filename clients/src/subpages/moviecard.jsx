import '../styles/show.css'

// import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';

const MovieCard = ({ movie, updateTime }) => {
  const handleTimeButtonClick = (selectedTime) => {
    // Call the callback function to send the selected time to the parent
    updateTime(selectedTime);
  };
  return (
    <div key={movie.id} className="movie-card">
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p> {movie.subtitle}</p>
        {/* <div className="movie-trailer">
           <FontAwesomeIcon icon={faPlay} />
           <a href={movie.trailer} target="_blank" rel="noopener noreferrer" style={{textDecoration: "underline", color: 'black' }}>Watch Trailer</a>
        </div> */}
        <p className="movie-details"> {movie.genre}</p>
        <div className="showtimes">
        {/* {movie.showtimes.map((time, index) => (
          <Link key={index} to={`/booking/${encodeURIComponent(movie.title)}`} className="showtime">
            {time}
          </Link>
        ))} */}
        {Array.isArray(movie.showtimes) ? (
        // Render multiple showtimes if showtimes is an array
        movie.showtimes.map((time, index) => (
          <Link key={index} to={`/booking/${encodeURIComponent(movie.title)}`} 
          onClick = {()=> { 
            if(window.location.pathname.startsWith('/booking')){handleTimeButtonClick(movie.time)}}} className="showtime">
            {time}
          </Link>
        ))
      ) : (
        // Render a single showtime if showtimes is not an array
        <Link
          to={`/booking/${encodeURIComponent(movie.title)}`}
          onClick={() => {
            // Check if the current pathname starts with "/booking"
            if (window.location.pathname.startsWith('/booking')) {
              handleTimeButtonClick(movie.time);
            }
          }}
          className="showtime"
        >
          {movie.time}
        </Link>

      )}

      </div>
      </div>
    </div>
  );
}


export default MovieCard;