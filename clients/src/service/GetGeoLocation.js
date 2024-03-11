import server from "./server_fetcher";

const GOOGLE_API_KEY = "AIzaSyB1eaA8Oni7KK62XtXsRgf1RPwZjb7j8Cs"

async function getUserLocation(GOOGLE_API_KEY) {
  return new Promise(async (resolve, reject) => {
    if ('geolocation' in navigator) {
      try {
        const position = await getCurrentPosition();
        const { latitude: lat, longitude: lng } = position.coords;
        const address = await reverseGeocode(lat, lng, GOOGLE_API_KEY);
        resolve({
          lat,
          lng,
          address
        });
      } catch (error) {
        console.error('Error getting user location:', error);
        reject(error);
      }
    } else {
      console.error('Geolocation is not available in this browser.');
      reject('Geolocation not available');
    }
  });
}


async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error)
    );
  });
}

async function reverseGeocode(lat, lng, apiKey) {
  const reverseGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(reverseGeocodeUrl);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const formattedAddress = data.results[0].formatted_address;
      return formattedAddress;
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    throw error;
  }
}


async function FindClosestTheater() {
  try {
    // Get the user's location from the Google Geolocation API
    const userLocation = await getUserLocation(GOOGLE_API_KEY);

    // Send the user's location to your server to find the closest theater
    const response = await server.fetch(`closest-theater?lat=${userLocation.lat}&lng=${userLocation.lng}`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();

    return {
      data, // This contains the user location and closest theater information
      userLocation
    }
  } catch (error) {
    console.error('Error finding the closest theater:', error);
    throw error;
  }
}

export default FindClosestTheater;