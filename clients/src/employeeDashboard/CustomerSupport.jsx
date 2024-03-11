import React, { useState } from "react";
import '../styles/managereservation.css';
import Users from "../service/Users";

function CustomerSupport() {
  const [reservationID, setReservationID] = useState('');
  const [customerReservation, setCustomerReservation] = useState(null);
  const [error, setError] = useState('');
  const [refundMessage, setRefundMessage] = useState('');

  const user = new Users();

  const getUserReservation = async (id) => {
    try {
      const res = await user.getPerUserReservation(id);
      if (res) {
        setCustomerReservation(res);
        // console.log(res);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching reservations');
      console.error(err);
    }
  };

  const handleReservation = () => {
    if (reservationID) {
      getUserReservation(reservationID);
    } else {
      setError('Please enter a Reservation ID.');
    }
  };

  const handleRefund = async (id) => {
    try {
      const refundResult = await user.requestRefund(id);
      if (refundResult) {
        // Handle the refund response message
        setRefundMessage(refundResult.message);
        console.log(refundResult);
      } else {
        setError('Refund request failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing the refund request');
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Customer Support</h2>
      <div style={{ width: '100%', height: '1px', backgroundColor: 'white', margin: '20px 0' }} />
  
      <form style={{ margin: 'auto', maxWidth: '300px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="reservationID" style={{ display: 'block' }}>Reservation ID:</label>
          <input
            type="text"
            id="reservationID"
            name="reservationID"
            value={reservationID}
            onChange={(e) => setReservationID(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
      </form>
  
      <button onClick={handleReservation} disabled={!reservationID}>Check Reservation</button>
  
      {error && <p style={{ color: 'red' }}>{error}</p>}
  
      {customerReservation && (
        <div>
          <br/>
          <h3>Customer Reservation Details</h3>
          {/* Loop over tickets and add refund buttons */}
          {refundMessage ? (
            // Display the refund message if it exists
            <p>{refundMessage}</p>
          ) : (
            // Display the ticket details and refund buttons if no refund message
            customerReservation.moviePass?.tickets.map((ticket, index) => (
              <div key={index}>
                {/* <p>Ticket {index + 1} Details:</p> */}
                <p>Seat: {ticket.assignedSeat}</p>
                <p>Price: {ticket.price}</p>
                <p>Tax: {ticket.tax}</p>
                <button onClick={() => handleRefund(reservationID)}>Refund</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}  


//   return (
//     <div style={{ textAlign: 'center' }}>
//       <h2>Customer Support</h2>
//       <div style={{ width: '100%', height: '1px', backgroundColor: 'white', margin: '20px 0' }} />

//       <form style={{ margin: 'auto', maxWidth: '300px' }}>
//         <div style={{ marginBottom: '10px' }}>
//           <label htmlFor="reservationID" style={{ display: 'block' }}>Reservation ID:</label>
//           <input
//             type="text"
//             id="reservationID"
//             name="reservationID"
//             value={reservationID}
//             onChange={(e) => setReservationID(e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px' }}
//           />
//         </div>
//       </form>

//       <button onClick={handleReservation}>Check Reservation</button>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {customerReservation && (
//         <div>
//           <br/>
//           <h3>Customer Reservation Details</h3>
//           {/* Loop over tickets and add refund buttons */}
//           {refundMessage ? (
//   // Display the refund message if it exists
//             <p>{refundMessage}</p>
//             ) : (
//               // Display the ticket details and refund buttons if no refund message
//               customerReservation.moviePass?.tickets.map((ticket, index) => (
//                 <div key={index}>
//                   {/* <p>Ticket {index + 1} Details:</p> */}
//                   <p>Seat: {ticket.assignedSeat}</p>
//                   <p>Price: {ticket.price}</p>
//                   <p>Tax: {ticket.tax}</p>
//                   <button onClick={() => handleRefund(reservationID)}>Refund</button>
//                 </div>
//               ))
//           )}

//           {/* <pre>{JSON.stringify(customerReservation, null, 2)}</pre> */}
//           {/* <div>
//             <p> Seat: {customerReservation.moviePass?.tickets[0].assignedSeat}</p>
//             <p> Seat: {customerReservation.moviePass?.tickets[0].price}</p>
//             <p> Seat: {customerReservation.moviePass?.tickets[0].tax}</p>
//           </div> */}
//         </div>
//       )}
//     </div>
//   );
// }

export default CustomerSupport;


// import { useEffect, useState } from "react";
// import '../styles/managereservation.css'
// import Users from "../service/user"

// function CustomerSupport() {
//     const [reservationID, setReservationID] = useState('');
//     const [customerName, setCustomerName] = useState('');
//     const [customerReservation, setCustomerReservation] = useState(null)

//     const getUserReservation = (id) => {
//       const user = new Users();
//       try{
//          const res = user.getPerUserReservation(id);
//          if(res){
//           setCustomerReservation(res)
//           console.log(res)
//          }
//       }catch(err){
//         console.error(err)
//       }
//     }
//     const handleRservation= ()=>{
//       if(reservationID){
//         getUserReservation(reservationID)
//       }
//     }
//     const handleNavigate = (path) => {
//       if (reservationID.trim() && customerName.trim()) {
//         // If both fields are filled, navigate to the path
//         window.location.href = path;
//       } else {
//         // If not, alert the user that the fields are required
//         alert('Please fill in all fields before proceeding.');
//       }
//     };

//     return (
//       <div style={{ textAlign: 'center' }}>
//         <h2>Customer Support</h2>
//         <div style={{ width: '100%', height: '1px', backgroundColor: 'white', margin: '20px 0' }} />
        
//         <form style={{ margin: 'auto', maxWidth: '300px' }}>
//           <div style={{ marginBottom: '10px' }}>
//             <label htmlFor="reservationID" style={{ display: 'block' }}>Reservation ID:</label>
//             <input
//               type="text"
//               id="reservationID"
//               name="reservationID"
//               value={reservationID}
//               onChange={(e) => setReservationID(e.target.value)}
//               required
//               style={{ width: '100%', padding: '8px' }}
//             />
//           </div>
  
//           {/* <div style={{ marginBottom: '10px' }}>
//             <label htmlFor="customerName" style={{ display: 'block' }}>Customer Name:</label>
//             <input
//               type="text"
//               id="customerName"
//               name="customerName"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//               required
//               style={{ width: '100%', padding: '8px' }}
//             />
//           </div> */}
//         </form>
  
//         {/* <div style={{ margin: '20px 0', textAlign: 'center' }} className="managereservation-direction">
//             <p
//               onClick={() => handleNavigate('/history')}
//               style={{ color: 'red', cursor: 'pointer', display: 'inline', margin: '10px 0' }}
//             >
//               Click here to manage reservation
//             </p>
//             <br />
//             <p
//               onClick={() => handleNavigate('/profile')}
//               style={{ color: 'red', cursor: 'pointer', display: 'inline', margin: '10px 0' }}
//             >
//               Click here to manage customer account
//             </p>
//         </div> */}

//       </div>
//     );
//   }
// export default CustomerSupport;