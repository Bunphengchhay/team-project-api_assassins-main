// Import any necessary modules
import { Theater } from "./Theater";
import server from "./server_fetcher";

export class TheaterCollection {
  constructor() {
    this.theaters = [];
  }

  // Function to calculate distance between two sets of coordinates
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  // Function to sort theaters by distance to the user
  // Function to sort theaters by distance to the user
  sortTheatersByDistance(lat, lng) {
    this.theaters.sort((a, b) => {
        const distanceA = this.calculateDistance(a.lat, a.lng, lat, lng);
        const distanceB = this.calculateDistance(b.lat, b.lng, lat, lng);
        return distanceA - distanceB;
    });
}



  async fetchTheatersAndMovies() {
    try {
      // Fetch theater data
      const response = await server.fetch('theaters');
      if (!response.ok) {
        throw new Error('Failed to fetch theaters');
      }
      const theaterData = await response.json();

      // Fetch schedules data
      const schedulesResponse = await server.fetch('schedules');
      if (!schedulesResponse.ok) {
        throw new Error('Failed to fetch schedules');
      }
      const schedulesData = await schedulesResponse.json();

      // Fetch movies data
      const moviesResponse = await server.fetch('movies');
      if (!moviesResponse.ok) {
        throw new Error('Failed to fetch movies');
      }
      const moviesData = await moviesResponse.json();

      // Construct Theater objects
      this.theaters = await theaterData.theaters.map((theater) => {
        return new Theater(theater, schedulesData.schedules, moviesData.movies);
      });
      
    } catch (error) {
      console.error('Error fetching theater data: ', error);
      throw error;
    }
  }

  getTheaters() {
    return this.theaters;
  }
  
}
