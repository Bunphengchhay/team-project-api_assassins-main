export default class MovieService {
    constructor(baseURL = "http://localhost:5002/api/movieRoutes") {
      this.BASE_URL = baseURL;
    }
  
    async fetchMovies(page = 1, limit = 50) {
      const endpoint = `${this.BASE_URL}/movie`;
      const config = {
        method: "GET",
        credentials: 'include'
      };
  
      const response = await fetch(endpoint, config);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return {
        total: parseInt(response.headers.get("X-Total-Count"), 10),
        data: data,
      };
    }
  
    // Other methods like fetchMovieById, searchMovies, etc. can be added here...
  }
  
  