import React, { useState } from 'react';

function Profile({ bookings }) {
  const [refundedBookings, setRefundedBookings] = useState([]);

  const handleRefundClick = (bookingId, isDateInPast) => {
    // Check if the booking has already been refunded
    if(isDateInPast){
      alert("Unable to refund")
    }
    else if (!refundedBookings.includes(bookingId)) {
      setRefundedBookings([...refundedBookings, bookingId]);
      // You can perform the refund action here and update the booking status if needed
    }
  };
  if( bookings === undefined){
    return <h3> There is no previous bookings </h3>
  }
  return (
    <div>
      <h3 style={{ textAlign: 'center', margin: '5%' }}> Your Past 30 days </h3>
      {bookings?.bookings?.map((booking) => {
        const bookingDate = new Date(booking?.purchaseDateTime);
        const currentDate = new Date();
        const isDateInPast = bookingDate < currentDate;

        return (
          <div
            key={booking._id}
            className={`card ${booking.status === 'refunded' ? 'card-flipped' : ''}`}
            style={{margin: '5%'}}
          >
            <div className="card-inner"  style={{margin: '5%'}}>
              <div className="card-front">
                <p style={{ margin: '5px 0' }}> Reservation ID: {booking?._id} </p>
                <p style={{ margin: '5px 0' }}> Date: {bookingDate.toLocaleDateString()} </p>
                <p style={{ margin: '5px 0' }}> Seats: {booking?.moviePass?.tickets.map((ticket) => ticket.assignedSeat).join(', ')} </p>
                <p style={{ margin: '5px 0' }}> Price: ${booking?.moviePass?.tickets.map((ticket) => ticket.price).reduce((total, price) => total + price, 0)} </p>
                <p style={{ margin: '5px 0' }}> Tax: ${booking?.moviePass?.tickets.map((ticket) => ticket.tax).reduce((total, tax) => total + tax, 0)}</p>
              </div>
              <div className="card-back">
                {booking.status === 'refunded' ? (
                  <h3>Refunded</h3>
                ) : isDateInPast ? (
                  <button
                    style={{ marginBottom: '5px' }}
                    onClick={() => handleRefundClick(booking._id, isDateInPast)}
                    disabled={refundedBookings.includes(booking._id)}
                  >
                    {refundedBookings.includes(booking._id) ? 'Refunded' : 'Refund'}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
      <p> Please contact us if you have any questions</p>
    </div>
  );
}

export default Profile;





