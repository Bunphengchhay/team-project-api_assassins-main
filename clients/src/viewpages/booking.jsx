import '../styles/show.css'
import sawX from '../assets/image/sawx.jpg'
import avatar from '../assets/image/avatar.jpeg'
import mermaid from '../assets/image/mermaid.jpeg'
import war1917 from '../assets/image/war1917.jpg'
import MovieCard from '../subpages/moviecard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
// Booking.jsx
import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import SeatSelection from '../subpages/SeatSelection'
import PreBooking from '../subpages/pre-booking'
import { useNavigate } from 'react-router-dom';
import { useTheaterContext, useUserContext } from '../navigation/TheaterContext'
import { Booking as bookings} from '../service/booking'
import { Schedule } from '../service/Schedule'
import { useAuth } from '../service/AuthenticationProvider'
// import { useHistory } from 'react-router-dom';


const Booking = () => {
   // Hooks should be used at the top level
  const navigate = useNavigate();
  const { title: urlTitle } = useParams();
  const decodedTitle = decodeURIComponent(urlTitle);
  const [playingTrailerId, setPlayingTrailerId] = useState(null);
  const [seatSelected, setSeatsSelected] = useState([]);
  const [count, setCount] = useState(0);
  // Initialize state for each piece of booking info
  const [time, setTime] = useState('7:30 PM'); // Placeholder time, change as needed
  const [tax, setTax] = useState(0.1); // Initialize with the appropriate tax
  const [discount, setDiscount] = useState(0.00); // Initialize with the appropriate discount
  const [reservationID, setReservationID] = useState('00000001'); // Placeholder ID, should be unique for each reservation
  const [movieLocation, setMovieLocation] = useState('San Jose XD'); // Placeholder location, change as needed
  const [fee, setFee] = useState(1.50); // Placeholder fee, change as needed
  const { closestTheaterInfo } = useTheaterContext();
  const [selectMovie, setSelectMovie] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [seatValidations, setSeatValidation] = useState(null);
  const [dummySeatData, setDummySeatData] = useState(seatsData);
  const {userDetails, setUserDetails} = useUserContext();
  const { user } = useAuth();
  const [userReward, setUserReward] = useState(user?.user?.member.reward || 0);
  const [showDate, setCurrentDate] = useState(new Date());
  const [rewardNotification, setRewardNotification] = useState('')
  const [useReward, setUsedRewared] = useState(0)
  const [reservationData, setReservationData] = useState(null)
  const [finalCartInfo, setCartInfo] = useState(null); // Initialize cartInfo as null
  const booking = new bookings();
  const schedule = new Schedule();
    // Update the current date every second (1000 milliseconds)
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentDate(new Date());
      }, 1000);
  
      // Clear the interval when the component unmounts
      return () => clearInterval(interval);
    }, []);
  
    // Format the date as a string (e.g., "yyyy-mm-dd HH:MM:SS")
    const formattedDate = showDate.toLocaleString();
  // const {
  //   currentUserLoc,
  //   currentUserTheater,
  //   theaterCollection,
  //   visibleTheaters,
  //   closestTheaterInfo,
  //   updateUserTheaterLocation,
  //   switchToClosestTheaterLocation,
  //   updateVisibleTheaters
  // } = useTheater();

   // Create a bookingInfo object that combines all the pieces of state
   const bookingInfo = {
    time,
    seatSelected,
    showDate,
    count,
    tax,
    discount,
    reservationID,
    movieLocation,
    fee,
    useReward
  };
 
  const cartInfo = { 
    bookingInfo,
    selectMovie,
    closestTheaterInfo,
    user,
    reservationData,
    reservationID

  }
  useEffect(()=>{
    if(user?.user?.member?.is_premium === "true"){
        setFee(0.00)
    }
  },[user])

  useEffect(()=>{
    if(reservationData){
      setCartInfo(reservationData)
    }
  },[reservationData])
  
  const findMovieId = (movieTitle, closestTheaterInfo) => {
    try {
      const movie = closestTheaterInfo?.movies.find((movie) => movie.movieTitle === movieTitle);
      
      if (movie) {
        return movie.id;
      } else {
        // Handle the case when the movie with the given title is not found
        return null; // or any appropriate value
      }
    } catch (err) {
      // Handle any other errors that might occur during the process
      console.error(err);
      return null; // or any appropriate value
    }
  };
  
  useEffect(() => {
    try {
      async function fetchData() {
        // Fetch the data asynchronously
        await Promise.all([booking.fetchBooking(), schedule.fetchSchedule()]);
  
        // Access the data using .get()
        const bookingData = booking.getBooking();
        const scheduleData = schedule.getSchedule();
  
        // Set the state after both promises have resolved
        setBookingData(bookingData);
        setScheduleData(scheduleData);
      }
  
      fetchData();
    } catch (err) {
      console.log("schedule or booking issue", err);
    }
  }, []);

  useEffect(()=>{
    if(seatValidations){
      setDummySeatData(seatValidations);
      // console.log(dummySeatData)
    }
  },[seatValidations])
  
  useEffect(() => {
    // this function use to find booked seat, so we can mark occupied on the seatselection
    if (closestTheaterInfo && bookingData && seatValidations) {
      const updatedSeatData = [...dummySeatData];
  
      bookingData.bookings.forEach((booking) => {
        if (
          booking.moviePass?.movieScreening === closestTheaterInfo.theaterId &&
          booking.moviePass?.tickets
        ) {
          booking.moviePass.tickets.forEach((ticket) => {
            const seatNumber = ticket.seatNumber;
            const seatIndex = updatedSeatData.findIndex(
              (seat) => seat.seatNumber === seatNumber
            );
  
            if (seatIndex !== -1) {
              // Update the status of the seat to "occupied" in the copied array
              updatedSeatData[seatIndex] = {
                ...updatedSeatData[seatIndex],
                status: 'occupied',
              };
            }
          });
        }
      });
      //  console.log(closestTheaterInfo.theaterId)
      //   console.log(updatedSeatData)
      // Set the updatedSeatData as the new state
      setDummySeatData(updatedSeatData);
    }
  }, [closestTheaterInfo, bookingData, seatValidations]);
 
  useEffect(()=>{
      try{
        if (closestTheaterInfo?.showtimes) {
            const currShow = closestTheaterInfo.showtimes.find((show)=> show.movieTitle === decodedTitle)
            // console.log(closestTheaterInfo)
            // console.log(currShow)
            setSelectMovie(currShow);
            const movie = {
              id: findMovieId(currShow?.movieTitle, closestTheaterInfo),
              title: currShow?.movieTitle || "",
              schedule_id: currShow?.schedule_id || "",
              genre: currShow?.genre || [],
              image: currShow?.poster || "",
              trailer: currShow?.trailer || "",
              time: extractTime(currShow?.dateTime) || "",
              dateTime: currShow?.dateTime || "",
              price: currShow?.price || 12.5,
              room: currShow?.room || "Room A",
              subtitle: 'At a time when it seems as if cinema experiences a new technological breakthrough every few months, it is oddly comforting that moviegoers can still be hooked by a film that is presented as being one unbroken shot. ',
            }
            setSelectMovie(movie);
            // console.log(movie)
            
        }
      }catch(err){
        console.log("This movie is not in curent showtimes", err)
      }
  }, [closestTheaterInfo, decodedTitle])

  useEffect(() => {
    if (selectMovie && closestTheaterInfo) {
      const seatArrangement = closestTheaterInfo.theaterRoom.find((room) => room.name === selectMovie.room);
      if (seatArrangement) {
        const seatValidation = Object.values(seatArrangement.seats)
          .reduce((acc, seatsInRow) => {
            acc.push(...Object.values(seatsInRow).map(seatNumber => ({ id: seatNumber, status: 'available' })));
            return acc;
          }, []);
        setSeatValidation(seatValidation);
      }
    }
  }, [selectMovie, closestTheaterInfo]);

  useEffect(() => {
    // const booking = new bookings();
    
    if (selectMovie) {
      // console.log('scheduled: ', selectMovie?.schedule_id)
      
      // Fetch booking data
      booking.getAllbookedSeat(selectMovie?.schedule_id || '6556f5a24f4fb138a3e890b2')
        .then((bookingSeatData) => {
          // Create a set of assigned seats for faster lookup
          const assignedSeatsSet = new Set(bookingSeatData.assignedSeats);
  
          // Map the seatValidation data to add a 'status' property to each seat
          const updatedSeatData = seatValidations.map(seat => ({
            id: seat.id, // Use the 'id' property of the object
            status: assignedSeatsSet.has(seat.id) ? 'occupied' : 'available'
          }));          
          
          setDummySeatData(updatedSeatData);
          // console.log(updatedSeatData);
        })
        .catch((error) => {
          console.error('Error fetching booking data: ', error);
        });
    }
  }, [selectMovie, seatValidations]);

  useEffect(()=>{
    if(closestTheaterInfo){
      setMovieLocation(closestTheaterInfo.theaterName)
    }
  },[])
  


  const handleChangeSeat = (selectedSeats) => {
    // Update the state with the new list of selected seats
    setSeatsSelected(selectedSeats);
    setCount(selectedSeats.length);
  };


  const findMovieByTitle = (title) => {
    return movies.find((movie) => movie.title === title);
  };
  
  const movie = findMovieByTitle(decodedTitle);

  if (!selectMovie) {
    return <div>No movie found for: {decodedTitle} </div>;
  }

  const playTrailer = (id) => {
    setPlayingTrailerId(id);
  };

   // Define a function to update the time state
   const updateTime = (selectedTime) => {
    setTime(selectedTime);
  };

  const handleClickReward = () => {
    // Assuming you have the user's reward value stored in user.user.member.reward
    const rewardValue = user?.user?.member?.reward || 0;
    // Calculate how many dollars (rounded to 2 decimal places) the user can redeem
    const dollarsToRedeem = Math.min(Math.floor(rewardValue / 50), 1);

    // Calculate the remaining rewards after redeeming
    const remainingRewards = rewardValue - dollarsToRedeem * 50;

    setUserReward(remainingRewards);
    setDiscount(dollarsToRedeem);
    setUsedRewared(rewardValue-remainingRewards)

    // You can also set the value directly in the input field
    // const rewardInput = document.getElementById('rewardInput');
    // rewardInput.value = rewardValue;
  };

  const handlePromoCode = () =>{
    setRewardNotification('invalid code')
  }

  
  async function createReservation(cartInfo, tickets, discount, scheduleData, selectMovie){
    return {
  
        buyerId: cartInfo?.user?.user?._id || '655ea97fab286d0eb25d3b5e',
        purchaseDateTime: cartInfo?.bookingInfo?.showDate || new Date(),
        moviePass: {
          movieScreening: selectMovie?.schedule_id || '6556b537c1378d306dee946e',
          tickets
        },
        discount: bookingInfo.discount,
        service_fee: 1.5,
        status: 'temporary', // Set as 'temporary'
        payment_info: {
          account: '',
          security_code_hashed: ''
        }
      };

  }

  async function updateTicket(ticketArray, cartInfo) {
    const ticketCost = parseFloat(cartInfo?.selectMovie?.price) || 15;
    const tax = ticketCost * parseFloat(cartInfo?.bookingInfo?.tax) || 1.5;
    const tickets = [];
  
    ticketArray.forEach((item) => {
      if (item) {
        tickets.push({ assignedSeat: item, price: ticketCost, tax: tax });
      }
    });
  
    return tickets;
  }

  async function handleReservation() {
    try {
      const tickets = await updateTicket(seatSelected, cartInfo);
      const finalServation = await createReservation(cartInfo, tickets, discount, scheduleData, selectMovie);
      const booking = new bookings();
      const reservationId = await booking.createTemporaryBooking(finalServation);
  
      if (reservationId) {
        console.log('Temporary booking created successfully');
        setReservationID(reservationId)
        setReservationData(finalServation)
        return { reservationId, finalServation }; // Return both values
      } else {
        console.log('Failed to create temporary booking.');
        alert("Please log in")
        return null; // Handle the case where reservationId is not available
      }
    } catch (error) {
      console.error('Cannot make reservation at this time:', error);
      return null; // Handle errors and return null
    }
  }
  

  const goToCart = async () => {
    try {
      const finalBooking = await handleReservation();
      if (finalBooking) {
        navigate('/cart', { state: { cartInfo: cartInfo, final: finalBooking } });
      }
    } catch (error) {
      console.log('Cannot make any booking at the moment ', error);
    }
  };
  
  


//   date, time, seatSelected, seatCount, tax, discount, reservationID, movieLocation, fee

  return (
    <div>
      {/* <button onClick={console.log(closestTheaterInfo)}> test </button> */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <h3 style={{ color: 'white', marginTop: '10px' }}>Booking</h3>
           <div style={{ width: '200px', height: '2px', backgroundColor: '#FFB43E', marginBottom: '5px' }}></div>
        </div>
        <div className='show-inner-container' style={{width: '100vw', display: 'flex', justifyContent: 'center', paddingLeft: '10%'}}>
        {playingTrailerId === 1 ? (
            <iframe
            width="200"
            hight="100%"
            src={`https://www.youtube.com/embed/${getStringAfterEquals(
                    selectMovie.trailer
                  )}?autoplay=1&mute=0`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={selectMovie.movietitle}
            />
        ) : (
            <div className="movie-poster-container" onClick={() => playTrailer(1)}>
            <img src={selectMovie.image} alt={selectMovie.title} className="movie-poster" />
            <FontAwesomeIcon icon={faPlayCircle} className="play-icon" />
            </div>
        )}
        <MovieCard movie={selectMovie} updateTime={updateTime}/>
      </div>
      <div style={{maxWidth: '100vw', backgroundColor: '#f2f2f2', display:'flex', justifyContent: 'center', borderRadius: '10px'}}>
        <SeatSelection seats = {dummySeatData} onSelectionChange={handleChangeSeat}/>
      </div>
      <br/>
     
      <div style={{maxWidth: '100%', color: 'black'}}>
        <PreBooking movie ={selectMovie} bookingInfo={bookingInfo}/>
      </div>

      <div style={{ width: '100%', backgroundColor: '#f2f2f2', color: 'black', marginTop: '2%', paddingTop: '1%', borderRadius: '5px', paddingLeft: '2%' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <label >
            Promotion Code:
          </label>
          <input
            style={{ width: '100px', height: '15px' }} // Adjust the width as needed
          />
          <button
            style={{ fontSize: 'x-small', backgroundColor: 'transparent', color: 'black', textDecoration: 'underline' }}
            onClick={handlePromoCode}
          >
          Use Code
          </button>
          <p style={{fontSize: 'small', color: 'red'}}> {`${rewardNotification}`} </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <label>Your current Reward:</label>
          <p style={{ width: '100px', height: '15px' }}>{userReward}</p>
          <button
            style={{ fontSize: 'x-small', backgroundColor: 'transparent', color: 'black', textDecoration: 'underline' }}
            onClick={handleClickReward}
          >
          Redeem
          </button>
        </div>
      {/* <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <label>Reward:</label>
        <input
          id="rewardInput"
          style={{ width: '100px', height: '15px' }}
          value={userReward} // Bind the value of the input to userReward
          readOnly // Make the input read-only so the user can't edit it
        />
      </div> */}
      </div>  


      <div className='prebooking-button'>
          <button onClick={goToCart}> Add to cart</button>
      </div>

    </div>
  );
};

export default Booking;

function rearrangeSeats(seats) {
  const result = [];
  
  for (const row in seats) {
    const rowSeats = seats[row].map((seatNumber) => {
      return {
        id: seatNumber,
        status: 'available', // You can set the initial status here
      };
    });
    
    result.push({
      row,
      seats: rowSeats,
    });
  }
  
  return result;
}
const seatsData = [
    { id: 'A1', status: 'available' },
    { id: 'A2', status: 'available' },
    { id: 'A3', status: 'available' },
    { id: 'A4', status: 'available' },
    { id: 'A5', status: 'available' },
    { id: 'A6', status: 'available' },
    { id: 'A7', status: 'available' },
    { id: 'A8', status: 'available' },
    { id: 'A9', status: 'occupied' },
    { id: 'A10', status: 'occupied' },
    { id: 'B1', status: 'available' },
    { id: 'B2', status: 'available' },
    { id: 'B3', status: 'available' },
    { id: 'B4', status: 'available' },
    { id: 'B5', status: 'available' },
    { id: 'B6', status: 'available' },
    { id: 'B7', status: 'available' },
    { id: 'B8', status: 'available' },
    { id: 'B9', status: 'occupied' },
    { id: 'B10', status: 'occupied' },
    { id: 'C1', status: 'available' },
    { id: 'C2', status: 'available' },
    { id: 'C3', status: 'available' },
    { id: 'C4', status: 'available' },
    { id: 'C5', status: 'available' },
    { id: 'C6', status: 'available' },
    { id: 'C7', status: 'available' },
    { id: 'C8', status: 'available' },
    { id: 'C9', status: 'occupied' },
    { id: 'C10', status: 'occupied' },
    
  ];

  function getStringAfterEquals(inputString) {
    const indexOfEquals = inputString.indexOf('=');
    if (indexOfEquals !== -1) {
      return inputString.substring(indexOfEquals + 1);
    } else {
      return null; // Return null if there is no '=' character in the input string
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


// Dummy data array
const movies = [
  {
    id: 1,
    title: 'Saw X',
    subtitle: 'Set between the events of SAW I and II, a sick and desperate John travels to Mexico for a risky and experimental medical procedure in hopes of a miracle cure for his cancer – only to discover the entire operation is a scam to defraud the most vulnerable.',
    rating: 'PG-13',
    genre: 'Thriller, Horror, Action',
    showtimes: ['2:00 pm', '4:30 pm', '7:00 pm', '9:30 pm'],
    image: sawX,
    trailer: 'QIEe3qsJZUQ',
    price: '12.99',
    date: [
      '12/5',
      '12/6',
      '12/7',
      '12/8',
      '12/9',
      '12/10',
      '12/11',
      '12/12',
      '12/13',
      '12/14',
    ]
  },
  {
    id: 2,
    title: 'Avatar',
    subtitle: 'Jake Sully (Sam Worthington), a paralyzed former Marine, becomes mobile again through one such Avatar and falls in love with a Na vi woman (Zoe Saldana). As a bond with her grows, he is drawn into a battle for the survival of her world.',
    rating: 'PG',
    genre: 'Family, Fantasy, Musical',
    showtimes: ['1:00 pm', '3:30 pm', '6:00 pm', '8:30 pm'],
    image: avatar,
    trailer: 'd9MyW72ELq0',
    price: '12.99',
    date: [
      '12/5',
      '12/6',
      '12/7',
      '12/8',
      '12/9',
      '12/10',
      '12/11',
      '12/12',
      '12/13',
      '12/14',
    ]

  },
  {
    id: 3,
    title: 'Little Mermaid',
    subtitle: 'The plot follows the mermaid princess Ariel, who is fascinated with the human world; after saving Prince Eric from a shipwreck, she makes a deal with the sea witch Ursula to walk on land.',
    rating: 'PG',
    genre: 'Family, Fantasy, Musical',
    showtimes: ['1:00 pm', '3:30 pm', '6:00 pm', '8:30 pm'],
    image: mermaid,
    trailer: 'kpGo2_d3oYE',
    price: '12.99',
    date: [
      '12/5',
      '12/6',
      '12/7',
      '12/8',
      '12/9',
      '12/10',
      '12/11',
      '12/12',
      '12/13',
      '12/14',
    ]
  },
  {
    id: 4,
    title: '1917',
    subtitle: 'At a time when it seems as if cinema experiences a new technological breakthrough every few months, it is oddly comforting that moviegoers can still be hooked by a film that is presented as being one unbroken shot. ',
    rating: 'PG',
    genre: 'Family, Fantasy, Musical',
    showtimes: ['1:00 pm', '3:30 pm', '6:00 pm', '8:30 pm'],
    image: war1917,
    trailer: 'YqNYrYUiMfg',
    price: 12.99,
    date: [
      '12/5',
      '12/6',
      '12/7',
      '12/8',
      '12/9',
      '12/10',
      '12/11',
      '12/12',
      '12/13',
      '12/14',
    ]
  },
  // ... more movies
];
