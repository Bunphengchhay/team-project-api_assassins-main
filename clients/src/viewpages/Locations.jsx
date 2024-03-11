import { useState, useEffect } from "react";
// import { useTheaterContext } from "../navigation/TheaterContext";
// import { TheaterCollection } from "../service/TheaterCollection";
// import FindClosestTheater from "../service/GetGeoLocation";
import useTheater from "../service/theaterAndUserHook";
import TheaterLocation from "../subpages/theaterLocation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
const defaultAddress = {
    street: "William",
    city: "San Jose",
    state: "CA",
    zipcode: 95128
} 
function Locations() {
    const {
        currentUserLoc,
        currentUserTheater,
        theaterCollection,
        visibleTheaters,
        closestTheaterInfo,
        updateUserTheaterLocation,
        switchToClosestTheaterLocation,
        updateVisibleTheaters
      } = useTheater();


    return ( 
        <div style={{backgroundColor: 'white', color: 'black'}}>
            <div className="d-flex align-item-center" style={{paddingTop: '10px', paddingBottom: '50px'}}>
                {/* <FontAwesomeIcon icon={faMapMarkerAlt} className="ms-3 me-3"/>  */}
                <p className="mb-0 me-3"> Your Theater: {closestTheaterInfo ? `${closestTheaterInfo.theaterName}` + " " + `${closestTheaterInfo.address.zipcode}`  : 'San Jose, 12345'}</p> 
                {/* <button className="topbar-location" style={{backgroundColor: 'transparent'}}>
                    <p className="mb-0" style={{ color: '#FF5252' }}>change</p>
                </button> */}
            </div>
            <div>
            {theaterCollection && theaterCollection.length > 0 ? (
                        <div className="theater-location-list">
                        {theaterCollection.slice(0, visibleTheaters).map((theater, index) => (
                        <div key={index}>
                            <button
                            key={`button-${index}`}
                            onClick={() => {
                              updateUserTheaterLocation({theater})
                            }}
                            >
                            Set This Location
                            </button>
                            <TheaterLocation key={`theater-${index}`} theater={theater} color={'black'}/>
                        </div>
                        ))}  
                        {visibleTheaters < theaterCollection.length && (
                        <button onClick={() => updateVisibleTheaters(prev => prev + 5)}>Show More</button>
                        )}

                    </div>
                    ) : (
                    <p style={{height: '100vh'}}>loading ....</p>
                    )}
            </div>
            {/* <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="ms-3 me-3"/> 
                <p className="mb-0 me-3">{closestTheaterInfo ? `${closestTheaterInfo.theaterName}` + " " + `${closestTheaterInfo.address.zipcode}`  : 'San Jose, 12345'}</p> 
                <button className="topbar-location" style={{backgroundColor: 'transparent'}}>
                    <p className="mb-0" style={{ color: '#FF5252' }}>change</p>
                </button>

                <div className='topbar-location-popup'>
                    <p>Input your zipcode</p>
                    <p>Current Location: {currentUserLoc ? `${currentUserLoc.userLocation.address}` : 'San Jose, CA'}</p>
                    <button
                        onClick={() => {
                        switchToClosestTheaterLocation();
                        }}
                        style={{backgroundColor: 'transparent', color: '#FFB43E', padding: '0'}}
                    >
                        Use Your Location
                    </button>
                    <br/>
                    <br/>
                    {theaterCollection && theaterCollection.length > 0 ? (
                        <div className="theater-location-list">
                        {theaterCollection.slice(0, visibleTheaters).map((theater, index) => (
                        <div key={index}>
                            <button
                            key={`button-${index}`}
                            onClick={() => {
                              updateUserTheaterLocation({theater})
                            }}
                            >
                            Set This Location
                            </button>
                            <TheaterLocation key={`theater-${index}`} theater={theater} />
                        </div>
                        ))}  
                        {visibleTheaters < theaterCollection.length && (
                        <button onClick={() => updateVisibleTheaters(prev => prev + 5)}>Show More</button>
                        )}

                    </div>
                    ) : (
                    <p>No theaters available</p>
                    )}
                    
                </div>

              
            </div> */}

        </div>
     );
}

export default Locations;

// function Locations() {
//     return ( <div>
//     </div> );
// }

// export default Locations;

// import React, { useState } from 'react';
// import '../styles/findtheater.css';

// const FindTheater = () => {
//   const [postalCode, setPostalCode] = useState('');
//   const [nearbyTheatres, setNearbyTheatres] = useState([]);

//   const handlePostalCodeChange = (e) => {
//     setPostalCode(e.target.value);
//   };

//   const handleFindTheatres = () => {
   
//     const dummyNearbyTheatres = [
//       { id: 1, name: 'Theatre A', location: '123 Main St' },
//       { id: 2, name: 'Theatre B', location: '456 Broadway Ave' },
//       { id: 3, name: 'Theatre C', location: '789 Elm St' },
//     ];

//     setNearbyTheatres(dummyNearbyTheatres);
//   };

//   return (
//     <div className="find-theatre">
//       <h2>Find Theatres Near You</h2>
//       <div className="input-section">
//         <label htmlFor="postal-code">Enter Postal Code:</label>
//         <input
//           type="text"
//           id="postal-code"
//           value={postalCode}
//           onChange={handlePostalCodeChange}
//           placeholder="Enter your postal code"
//         />
//         <button onClick={handleFindTheatres}>Find Theatres</button>
//       </div>
//       <div className="theatre-list">
//         {nearbyTheatres.length > 0 ? (
//           <ul>
//             {nearbyTheatres.map((theatre) => (
//               <li key={theatre.id}>
//                 <strong>{theatre.name}</strong>
//                 <p>{theatre.location}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No theatres found nearby.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FindTheater;
