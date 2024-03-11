  
import React, { useEffect } from 'react';
import '../styles/prebooking.css'; // Adjust the path as needed

function PreBooking({ movie, bookingInfo }) {
    if (movie === undefined || bookingInfo === undefined) {
        return null;
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const ticketCost = parseFloat(movie.price) * bookingInfo.count;
    const tax = ticketCost * parseFloat(bookingInfo.tax);
    const totalCost = ticketCost + tax + bookingInfo.fee - parseFloat(bookingInfo.discount);


    return (
        <div className='prebooking'>
          <h3> {movie.title}</h3>
           <div className='prebooking-info'>
              <div className='prebooking-info-details'>
                    <p>Reservation id: {bookingInfo.reservationID}</p>
                    <p>Show Date: {new Date().toLocaleDateString()}</p>
                    <p>Time: {bookingInfo.time}</p>
                    <p>Seat Number: {bookingInfo.seatSelected.join(', ')}</p>
                    <p>Reserved on: {new Date().toLocaleDateString()}</p>
                    <p>Location: {bookingInfo.movieLocation}</p>
              </div>
              <div id = 'horizontal-line'> </div>
              <div className='prebooking-info-price'>
                    <p>Number of tickets: {bookingInfo.count}</p>
                    <p>Ticket Cost: {formatCurrency(ticketCost)}</p>
                    <p>Tax: {formatCurrency(tax)}</p>
                    <p>Fee: {formatCurrency(bookingInfo.fee)}</p>
                    <p>Discount: {formatCurrency(bookingInfo.discount)}</p>
                    <p className='total-cost'>
                      Total Cost: {totalCost <= bookingInfo.fee ? formatCurrency(0) : formatCurrency(totalCost)}
                    </p>
                    <p> Incoming Points: {totalCost <= bookingInfo.fee ? 0 : totalCost} {   }</p>
              </div>
           </div>
          
        </div>
    );
}

export default PreBooking;
