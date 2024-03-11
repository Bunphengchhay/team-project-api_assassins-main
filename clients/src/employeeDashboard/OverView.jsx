import '../styles/overview.css'
import useTheater from '../service/theaterAndUserHook';
import { useEffect, useState } from 'react';
import { EmployeeDashboardStat } from '../service/EmployeeDashboardStat'

// Dummy data for the overview statistics
const statistics = {
  customerBookings: 154,
  movieShows: 12,
  revenue: 10234.99
};

function Overview() {
  const { theaterCollection, refreshTheater } = useTheater();
  const [stat, setStat] = useState();
  const Employee = new EmployeeDashboardStat();
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function admin() {
      try {
        const data = await Employee.getDashboardOverview(); // Corrected method name
        setStat(data); // Update state with received data
        // console.log(data);
      } catch (error) {
        console.error('Error fetching overview stats:', error);
        // Optionally, handle the error, e.g., set an error state
      }
    }

    admin(); // Call the function here
  }, []); // Empty dependency array means this effect runs once on component mount

  // useEffect(()=>{
  //   console.log()
  // },[])
  // ... rest of your component
  if(!stat){
    return <p> Loading ... </p>
  }
  return (
    <div className="overview">
      <h1>Dashboard Overview</h1>

      <div>
        <label htmlFor="theaterSearch" style={{width: '25%'}}>Search Theater: </label>
        <input
          id="theaterSearch"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter theater name"
        />
      </div>
  <h3> Past 30 days</h3>
      {stat.filter(theater => theater.theaterName.toLowerCase().includes(query.toLowerCase())).map((theater) => (
    <div key={theater.theaterId} style={{margin: '2%', padding: '1%'}} className='theaterCard'>
      <p>Theater: {theater.theaterName}</p>
      <p>Occupancy: {theater.occupancy.totalSeatCapacity}</p>
      <div>
        <p>Rooms:</p>
        <ol>
          {theater.occupancy.rooms.map((room, index) => (
            <li key={index}> {/* Using index as a key, ensure that room names are unique */}
              <p>Room: {room.roomName}</p>
              <p>Capacity: {room.numberOfSeats}</p>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <p>Movies:</p>
        {theater.movies.map((movie, index) => (
          <div key={index} style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}> {/* Adding inline style for bottom border */}
            <p>Title: {movie.movieTitle}</p>
            <p>Number of Booked Seats: {movie.bookedSeats}</p>
          </div>
        ))}

            </div>
          </div>
        ))
      }
      <h3> Past 60 Days </h3>
      <div style={{backgroundColor: 'white', width: '95%', height: '1px'}}> </div>
      <h3> Past 90 Days</h3>
    </div>
  );
};

export default Overview;
