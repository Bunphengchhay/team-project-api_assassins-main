import React from 'react';
import SmallCard from '../subpages/card';
import '../styles/homepage.css'
import avatar from '../assets/image/avatar.jpeg'
import war1917 from '../assets/image/war1917.jpg'
import sawx from '../assets/image/sawx.jpg'
import mermaid from '../assets/image/mermaid.jpeg'
import popcorn from '../assets/image/popcorn.JPG'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { useTheaterContext } from '../navigation/TheaterContext';
import UpcomingMovie from '../subpages/upcomingmoviecard';
// import { useLocation } from 'react-router-dom'; // Import useLocation
function HomePage() {
    // Data for cards with images added
    const cardData = [
        { title: 'SawX', text: 'Some quick example text to build on the card title.', buttonText: 'Tickets', image: sawx },
        // { title: 'Avatar', text: 'Some quick example text to build on the card title.', buttonText: 'Tickets', image: avatar },
        { title: '1917', text: 'Some quick example text to build on the card title.', buttonText: 'Tickets', image: war1917 },
        // { title: 'Little Mermaid', text: 'Some quick example text to build on the card title.', buttonText: 'Tickets', image: mermaid },
    ];
    const { closestTheaterInfo } = useTheaterContext();
    // const location = useLocation(); // Get the location object
    // Check if the state was passed via the navigate function
    // const closestTheaterInfo = location.state?.closestTheaterInfo;

    return ( 
        // transform: 'translateY(-150px)', zIndex: '9999'  // technical debt. cant move it on top of top bar background. 
        <div style={{ color: 'white', height:'auto' }}>
                <div style={{textAlign:'center'}}>
                    <h3> Spiderman Far From Home</h3>
                    <div style={{display:'flex', justifyContent:'center', gap: '20px'}}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <FontAwesomeIcon icon={faPlay} style={{ color: 'yourColorHere', marginRight: '8px' }} />
                            <p style={{margin: 0}}>Watch Trailer</p>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <FontAwesomeIcon icon={faTicketAlt} style={{ color: 'yourColorHere', marginRight: '8px' }} />
                            <a href='/show' style={{color: 'white'}}><p style={{margin: 0}}>Get Tickets Now</p></a>
                        </div>
                    </div>
                   <a>  <h2> NOW PLAYING </h2> </a>
                   <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{width: '20vw', backgroundColor: '#FFB43E', height: '2px'}}> </div>
                   </div>
                </div>

                <div className="card-container">
                    {/* {cardData.map((card, index) => (
                    <SmallCard 
                        key={index} 
                        title={card.title} 
                        text={card.text} 
                        buttonText={card.buttonText} 
                        image={card.image} // Pass the image URL to the SmallCard component
                    />
                    ))} */}
                    {closestTheaterInfo? (
                        closestTheaterInfo.showtimes?.map((data, index) => (
                            // Render using closestTheaterInfo data
                            <SmallCard
                            key={index}
                            title={data.movieTitle || ""}
                            text={"get ticket"} // You should replace this with the actual genre data
                            buttonText={"Tickets"}
                            image={data.poster}
                            />
                        ))
                        ) : (
                        // Render using cardData
                   
                        cardData.map((card, index) => (
                            <SmallCard
                            key={index}
                            title={card.title}
                            text={card.text}
                            buttonText={card.buttonText}
                            image={card.image}
                            />
                        ))
                   
                        )}
                       



                </div>

                <div style={{marginTop: '10%', marginBottom: '10%'}}>
                    <h3 style={{textAlign: 'center'}}> COMING NEXT </h3>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{width: '20vw', backgroundColor: '#FFB43E', height: '2px'}}> </div>
                   </div>
                   <div style={{marginTop: '5%'}}>
                            <UpcomingMovie images = {cardData}/>
                   </div>
                </div>

            
                <div className='homepage-second' style={{
                    display: 'flex',
                    flexDirection: 'row', // Default to side by side
                    alignItems: 'center', // Align items vertically in the center
                    flexWrap: 'wrap', // Allow items to wrap on resize
                    marginTop: '5%',
                    marginBottom: '5%'
                }}>
                    <div style={{
                        flex: '1', // Flex grow according to its flex basis
                        flexBasis: '40%', // Default basis
                        maxWidth: '40%', // Maximum width percentage of its parent
                        marginLeft: '2%'
                    }}>
                        <img src={popcorn} style={{ width: '100%' }} alt="Popcorn" />
                    </div>
                    <div style={{
                        flex: '1', // Flex grow according to its flex basis
                        flexBasis: '50%', // Default basis
                        maxWidth: '60%', // Maximum width percentage of its parent
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center', // Center vertically
                        textAlign: 'center', // Center text horizontally
                        margin: '5px'
                    }}>
                        <h1> Get your drink and popcorn </h1>
                        <p style={{fontSize:'10px'}}> Indulge in the ultimate movie experience with our gourmet, buttery popcorn and a wide selection of refreshing beverages. Elevate your senses as you savor the perfect companions to our thrilling on-screen entertainment. Sit back, relax, and let the flavors burst as the story unfolds. Your next visit to our theater isn't complete without our freshly-popped popcorn and a cold drink in hand. </p>
                        <button style={{
                            alignSelf: 'center', // Center the button horizontally
                            padding: '2px 10px', // Adjust the size of the button with padding
                            backgroundColor: '#FFB43E',
                            border: 'none', // Remove the default border
                            borderRadius: '20px', // Rounded corners
                            cursor: 'pointer', // Cursor indicates a clickable button
                            color: 'white', // Text color for the button
                            fontSize: '1em', // Adjust the font size as needed
                            marginTop: '10px', // Add space above the button
                        }}> Order Now </button>
                    </div>
                </div>


        </div>
    );
}


export default HomePage;
