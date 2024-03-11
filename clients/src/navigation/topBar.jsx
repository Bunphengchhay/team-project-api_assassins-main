import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React, { useState, useEffect } from 'react';
import "../styles/topbar.css"
import TheaterLocation from '../subpages/theaterLocation';
import useTheater from '../service/theaterAndUserHook';
import authentication from '../service/authentication';
import { isElementAccessExpression } from 'typescript';
import { useAuth } from '../service/AuthenticationProvider' // Import the useAuth hook from your AuthenticationProvider
// import { useAuth } from '../service/AuthenticationProvider';


const defaultAddress = {
    street: "William",
    city: "San Jose",
    state: "CA",
    zipcode: 95128
} 
function TopBar() {
    const [auth, setAuth] = useState(null);
    // const [user, setUser] = useState({});
    const [name, setName] = useState("Login");
    const checkAuth = localStorage.getItem("authenticated")

//   const [user, setAuth] = useState(null); // Initialize auth state to null
//   const [name, setName] = useState("Login"); // Initialize name state to an empty string
//   const { user, logout } = useAuth(); // Use the authentication context hook
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

  const { user } = useAuth();

  useEffect(() => {
    // Do something when the authentication status changes
    if (user) {
      // User is authenticated
      // setUser(user)
      setName(user?.user?.name || "Login")
    //   console.log('User authentication status:', user);
      // Update your component accordingly
    } else {
      // User is not authenticated
    //   console.log('User is not authenticated');
      // Update your component accordingly
    }
  }, [user]);


    return ( 

        <div style={{ backgroundColor: '#A30000', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.1rem', fontSize:'70%' }}>
            <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="ms-3 me-3"/> {/* This will render the location marker icon */}
                <p className="mb-0 me-3">{closestTheaterInfo ? `${closestTheaterInfo.theaterName}` + " " + `${closestTheaterInfo.address.zipcode}`  : 'San Jose, 12345'}</p> 
                <button className="topbar-location" style={{backgroundColor: 'transparent'}}>
                    <p className="mb-0" style={{ color: '#FF5252' }}>change</p>
                </button>

                <div className='topbar-location-popup'>
                    {/* <p>Input your zipcode</p> */}
                    <p>Current Location: {currentUserLoc ? `${currentUserLoc.userLocation.address}` : 'San Jose, CA'}</p>
                    <button
                        onClick={() => {
                        switchToClosestTheaterLocation(); // Call this function to switch back to closest theater location
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
                                //setUserLoc({name: theater.theaterName, address: theater.address}); // Update user location
                              updateUserTheaterLocation({theater})
                            }}
                            >
                            Set This Location
                            </button>
                            <TheaterLocation key={`theater-${index}`} theater={theater} color = {'white'}/>
                        </div>
                        ))}  
                        {visibleTheaters < theaterCollection.length && (
                        // <button onClick={() => setVisibleTheaters((prev) => prev + 5)}>Show More</button>
                        <button onClick={() => updateVisibleTheaters(prev => prev + 5)}>Show More</button>
                        )}

                    </div>
                    ) : (
                    <p>No theaters available</p>
                    )}
                    
                </div>

              
            </div>

            <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faUser} />
                {user?.authenticated ? ( // Check if the user is authenticated
                    <Nav.Link href="/profile" className="ms-3 me-3">
                        {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p className="mb-0 ms-2">{name}</p>
                        </div> */}
                    </Nav.Link>
                ) : (
                    <Nav.Link href="/Login" className="ms-3 me-3">
                        {name}
                    </Nav.Link>
                )}
                {user?.authenticated ? (
                <NavDropdown title= {name} id="navbarScrollingDropdown" className="ms-2 me-3">
                     {/* {auth?.authenticated ? (  */}
                        <>
                            <NavDropdown.Item href="/Profile">User Profile</NavDropdown.Item>
                            <NavDropdown.Item href="/Profile?page=payment">Payments</NavDropdown.Item>
                            <NavDropdown.Item href="/Profile?page=security">Change Passwords</NavDropdown.Item>
                            <NavDropdown.Divider />
                            {/* Render the "Admin Dashboard" link conditionally based on user role */}
                            {user?.user?.role?.length > 0 && user?.user?.role?.some(role => ['admin', 'employee'].includes(role)) ? (
                            <NavDropdown.Item href="/dashboard">Admin Dashboard</NavDropdown.Item>
                            ) : null}


                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/Logout">Logout</NavDropdown.Item>
                        </>
                     {/* ) : null} */}
                </NavDropdown>
                ): null}
                <Nav.Link href="/cart" className="me-3">
                    <FontAwesomeIcon icon={faShoppingCart} />
                </Nav.Link>
            </div>

        </div>


     );
}

export default TopBar;


