import { useState, useEffect } from 'react';
// import { FindClosestTheater, TheaterCollection } from './your-theater-functions'; // Import your theater-related functions
import FindClosestTheater from './GetGeoLocation';
import { TheaterCollection } from './TheaterCollection';
import { useTheaterContext } from '../navigation/TheaterContext';

function useTheater() {
  const [currentUserLoc, setUserLoc] = useState(null);
  const [currentUserTheater, setCurrentUserTheater] = useState(null);
  const [theaterCollection, setTheaterCollection] = useState(null);
  const [visibleTheaters, setVisibleTheaters] = useState(5);
  const { closestTheaterInfo, setTheaterInfo } = useTheaterContext(); // Use the context hook with the correct names

  useEffect(() => {
    const storedCurrentUserTheater = JSON.parse(localStorage.getItem('currentUserTheaterSet'));
    if (storedCurrentUserTheater) {
      setCurrentUserTheater(storedCurrentUserTheater);
    }

    const storedClosestTheaterInfo = JSON.parse(localStorage.getItem('theaterLocation'));
    if (storedClosestTheaterInfo) {
      setTheaterInfo(storedClosestTheaterInfo);
    }
  }, []);

  useEffect(() => {
    async function getClosestTheaterData() {
      try {
        const data = await FindClosestTheater();
        setUserLoc(data);
        localStorage.setItem('userLoc', JSON.stringify(data));
      } catch (err) {
        console.log('Cannot fetch closest data', err);
      }
    }
    if (!currentUserLoc) getClosestTheaterData();
  }, [closestTheaterInfo, theaterCollection]);

  useEffect(() => {
    // if (currentUserLoc) {
      async function getAllTheater() {
        try {
          const theaterColl = new TheaterCollection();
          await theaterColl.fetchTheatersAndMovies();
          setTheaterCollection(theaterColl.getTheaters());
        } catch (err) {
          console.log('Could not find theater', err);
        }
      }
      // console.log('triger')
      if (!theaterCollection) getAllTheater();
    // }
  }, [currentUserLoc, currentUserTheater]);

  useEffect(() => {
    if (theaterCollection && currentUserLoc) {
      const theater = theaterCollection.find((theater) => currentUserLoc.data.closestTheater.name === theater.theaterName);
      setTheaterInfo(theater);
      setCurrentUserTheater(theater);
      localStorage.setItem('theaterLocation', JSON.stringify(theater));
      localStorage.setItem('currentUserTheaterSet', JSON.stringify(theater));
    }
  }, [theaterCollection, currentUserLoc]);

  const updateUserTheaterLocation = (theater) => {
    setTheaterInfo(theater.theater);
    localStorage.setItem('theaterLocation', JSON.stringify(theater.theater));
  };

  const switchToClosestTheaterLocation = async () => {
    try {
      setTheaterInfo(currentUserTheater);
      localStorage.setItem('theaterLocation', JSON.stringify(currentUserTheater));
    } catch (err) {
      console.log('Cannot fetch closest theater data', err);
    }
  };

  // Function to update visibleTheaters
  const updateVisibleTheaters = (newVisibleTheaters) => {
    setVisibleTheaters(newVisibleTheaters);
  };

  // const refreshTheater = ()=>{
  //   async function getAllTheater() {
  //     try {
  //       const theaterColl = new TheaterCollection();
  //       await theaterColl.fetchTheatersAndMovies();
  //       setTheaterCollection(theaterColl.getTheaters());
  //     } catch (err) {
  //       console.log('Could not find theater', err);
  //     }
  //   }
  //   // if (theaterCollection && currentUserLoc) {
  //   //   const theater = theaterCollection.find((theater) => currentUserLoc.data.closestTheater.name === theater.theaterName);
  //   //   setTheaterInfo(theater);
  //   //   setCurrentUserTheater(theater);
  //   //   localStorage.setItem('theaterLocation', JSON.stringify(theater));
  //   //   localStorage.setItem('currentUserTheaterSet', JSON.stringify(theater));
  //   // }
  //   getAllTheater();
  // }
  


  return {
    currentUserLoc,
    currentUserTheater,
    closestTheaterInfo,
    theaterCollection,
    visibleTheaters,
    updateUserTheaterLocation,
    switchToClosestTheaterLocation,
    updateVisibleTheaters
  };
}

export default useTheater;
