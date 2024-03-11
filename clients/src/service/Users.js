import server from "./server_fetcher";


export default class Users{
        headers ={
            'Content-Type': 'application/json'
        }
    constructor(){

    }
    async getUser(userId){
      try {
        const response = await server.fetch(`bookings/${userId}`, { // Use userId to construct the URL
          method: "GET"
        });
  
        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          console.log("Error fetching user reservations:", response.status);
          return null;
        }
      } catch (error) {
        console.error('Error fetching user reservations:', error);
        return null;
      }
    }
    async getPerUserReservation(userId) {
        try {
          const response = await server.fetch(`bookings/${userId}`, { // Use userId to construct the URL
            method: "GET"
          });
    
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.log("Error fetching user reservations:", response.status);
            return null;
          }
        } catch (error) {
          console.error('Error fetching user reservations:', error);
          return null;
        }
      }

      async requestRefund(bookingId) {
        try {
          const response = await server.fetch(`bookings/refund/${bookingId}`, { // Add a slash before bookingId
            method: "PUT",
            headers: this.headers,
          });
      
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.log("Error requesting refund:", response.status);
            return null;
          }
        } catch (error) {
          console.error('Error requesting refund:', error);
          return null;
        }
      }
      
}