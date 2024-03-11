import "../styles/theaterLocation.css";

function TheaterLocation({ theater, color}) {
  if (theater === undefined) {
    return <div className="theaterLocation"> "Loading .... "</div>;
  }
  const theaterAddress= theater ? theater.address.street + ", " + theater.address.city + ", " + theater.address.state + ", " + theater.address.zipcode : "San Jose, CA"
  const borderBottomStyle = `solid ${color}`; 
  return (
    <div className="theaterLocation" style={{borderBottom: borderBottomStyle}}>
      <p style={{ color: color, fontWeight: 'bolder' }}> {`${theater.theaterName}`} </p>
      <p style={{ color: color}} className= 'theaterAddress'> Theater: {`${theaterAddress}` } </p>
      <div>
        <h3> NOW PLAYING </h3>
        {theater && theater.showtimes.length > 0 ? (
          <div className="movie-title-container">
            {theater.showtimes.map((showtime, index) => (
              <div key={index} className="movie-title-box">
                {showtime.movieTitle}
              </div>
            ))}
          </div>
        ) : (
          <p>No movies available</p>
        )}
      </div>
    </div>
  );
}

export default TheaterLocation;
