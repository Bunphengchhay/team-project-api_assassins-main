import server from "./server_fetcher";

export class Booking{
    constructor(){
        this.booking = []
    }

    getBooking(){
        return this.booking;
    }
    
    async getAllUserBookingById(userId) {
      try {
        // const response = await fetch(`${this.apiUrl}/bookings-user/${userId}`, {
          const response = await server.fetch(`/bookings-user/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          const errorMessage = `Request failed with status: ${response.status}`;
          throw new Error(errorMessage);
        }
    
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Unable to get history:', error);
        throw error; // Re-throw the error to allow the caller to handle it
      }
    }
    

    async getAllbookedSeat(scheduleId) {
      try {
          const response = await server.fetch(`bookings-seat?scheduleId=${scheduleId}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
  
          if (!response.ok) {
              throw new Error('Failed to find occupied seat');
          }
  
          const bookingSeat = await response.json();
          return bookingSeat; // Return the data fetched from the API
  
      } catch (error) {
          console.log('Error fetching booking data: ', error);
          throw error; // Re-throw the error to handle it at the caller's level if needed
      }
  }
  

    async fetchBooking() {
        try {
          // Fetch theater data
          const response = await server.fetch('bookings');
          if (!response.ok) {
            throw new Error('Failed to fetch theaters');
          }
          const theaterData = await response.json();
          this.booking = theaterData;
          
        } catch (error) {
          console.error('Error fetching theater data: ', error);
          throw error;
        }
      }

      async createTemporaryBooking(reservationData) {
        try {
          const response = await server.fetch('bookings/temporary', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData),
          });
      
          // console.log('Request:', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify(reservationData),
          // });
      
          // console.log('Response:', response);
      
          if (response.ok) {
            const result = await response.json();
            // console.log('Temporary booking created successfully:', result);
            return result.reservationId;
          } else {
            const errorData = await response.json();
            console.error('Error creating temporary booking:', errorData.message);
          }
        } catch (error) {
          console.error('Error creating temporary booking:', error);
        }
      }
      
      async updatePaymentInfo(reservationId, account, securityCode) {
        try {
          // Create a request body with payment information
          const paymentData = {
            reservationId,
            account,
            securityCode,
          };
          // console.log("from server", paymentData)
      
          const response = await server.fetch('bookings-payment', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData), // Send the payment data in the request body
          });
      
          // console.log('Request:', {
          //   method: 'PUT',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify(paymentData),
          // });
      
          if (response.ok) {
            // Handle successful response, e.g., show a success message to the user
            console.log('Payment information updated successfully');
            return { success: true, message: 'Payment information updated successfully' };
          } else {
            // Log the response for debugging
            console.log('Error response:', response);
      
            // Handle error response
            console.error('Error updating payment information:', response.statusText);
            return { success: false, message: 'Error updating payment information', error: response.statusText };
          }
        } catch (error) {
          console.error('Error updating payment information:', error);
          return { success: false, message: 'Error updating payment information', error: error.message };
        }
      }
      
      
      

      // async updatePaymentInfo({ reservationId, account, securityCode }) {
      //   try {
      //     const paymentData = {
      //       _id: reservationId,
      //       account,
      //       security_code_hashed: securityCode, // Corrected field name
      //     };
      
      //     const response = await server.fetch('bookings/payment', {
      //       method: 'PUT',
      //       credentials: 'include',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify(paymentData),
      //     });
      
      //     console.log('Request:', {
      //       method: 'PUT', // Corrected HTTP method
      //       credentials: 'include',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify(paymentData),
      //     });
      
      //     console.log('Response:', response);
      
      //     if (response.ok) {
      //       // Handle successful response, e.g., show a success message to the user
      //       console.log('Payment information updated successfully');
      //     } else {
      //       // Handle error response
      //       const errorData = await response.json();
      //       console.error('Error updating payment information:', errorData.message);
      //       // Display an error message to the user
      //     }
      //   } catch (error) {
      //     console.error('Error updating payment information:', error);
      //     // Handle network or other errors
      //   }
      // }
      
      
      
}