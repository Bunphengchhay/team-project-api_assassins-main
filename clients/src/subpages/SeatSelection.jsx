import React, { useState } from 'react';

const SeatMap = ({ seats, onSelectionChange }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [notification, setNotification] = useState('');

  const toggleSeatSelection = (seatId) => {
    const selectedSeat = seats.find((seat) => seat.id === seatId);

    if (selectedSeat && selectedSeat.status !== 'occupied') {
      setSelectedSeats((prevSelectedSeats) => {
        let newSelectedSeats;

        if (prevSelectedSeats.includes(seatId)) {
          // If the seat is already selected, remove it
          newSelectedSeats = prevSelectedSeats.filter((id) => id !== seatId);
        } else {
          // If the seat is not selected, check if the maximum selection count (8) has been reached
          if (prevSelectedSeats.length < 8) {
            newSelectedSeats = [...prevSelectedSeats, seatId];
          } else {
            // Maximum selection count reached, display a notification
            setNotification('Can only select up to 8 seats');
            return prevSelectedSeats;
          }
        }

        // Clear the notification after a brief delay (e.g., 2 seconds)
        setTimeout(() => {
          setNotification('');
        }, 2000);

        onSelectionChange(newSelectedSeats);
        return newSelectedSeats;
      });
    }
  };

  const seatSize = 20; // New seat size
  const seatSpacing = seatSize * 3; // New seat spacing
  const seatsPerRow = 10;
  const numRows = Math.ceil(seats.length / seatsPerRow);
  const svgWidth = seatSpacing * seatsPerRow + seatSize; // Additional space for margins
  const svgHeight = seatSpacing * numRows + 100; // Increase space for screen and legend

  // Calculate the midpoint for the quadratic curve control point
  const halfSvgWidth = svgWidth / 2;
  // Calculate the y-coordinate for the control point. Adjust the value '15' as needed for more or less curvature
  const curveHeight = 15;
  // Calculate the endpoints for the screen line, making sure they are within the margins
  const startX = 10;
  const endX = svgWidth - 45;
  return (
    <div>
      {notification && (
        <div className="notification" style={{color: 'goldenrod'}}>
          {notification}
        </div>
      )}
      <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="svg-seat">
        {/* Screen - make it larger and more prominent */}
        <path d={`M${startX},35 Q${halfSvgWidth},${curveHeight} ${endX},35`} fill="none" stroke="black" strokeWidth="3" />
        <text 
          x={svgWidth / 2 -20} 
          y="30" 
          fontSize="6" 
          fill="black" 
          textAnchor="middle" 
          alignmentBaseline="central"
        >
          SCREEN
      </text>

        {/* Seats */}
        {seats.map((seat, index) => {
          const isSelected = selectedSeats.includes(seat.id);
          const x = seatSpacing * (index % seatsPerRow) + 10;
          const y = seatSpacing * Math.floor(index / seatsPerRow) + 60; // Adjusted for larger screen size

          return (
            <g key={seat.id} onClick={() => toggleSeatSelection(seat.id)}>
              <rect
                x={x}
                y={y}
                width={seatSize}
                height={seatSize}
                fill={isSelected ? 'green' : seat.status === 'occupied' ? 'red' : 'gray'}
                stroke="black"
                strokeWidth="0.5"
              />
              <text
                x={x + seatSize/2}
                y={y + seatSize/2}
                fontSize="5"
                fill="white"
                textAnchor="middle"
                alignmentBaseline="central"
              >
                {seat.id}
              </text>
            </g>
          );
        })}

        {/* Legend - make it larger and more readable */}
        <text x="10" y={svgHeight - 20} fontSize="6" fill="black" textAnchor="start" alignmentBaseline="central">
          Seat: {selectedSeats.join(', ')}
        </text>
        <g transform={`translate(${svgWidth - 120}, ${svgHeight - 30})`}>
          <rect width="10" height="10" fill="gray" stroke="black" strokeWidth="0.5" />
          <text x="12" y="5" fontSize="5" fill="black" alignmentBaseline="middle">
            Available
          </text>
        </g>
        <g transform={`translate(${svgWidth - 120}, ${svgHeight - 15})`}>
          <rect width="10" height="10" fill="red" stroke="black" strokeWidth="0.5" />
          <text x="12" y="5" fontSize="5" fill="black" alignmentBaseline="middle">
            Taken
          </text>
        </g>
      </svg>
    </div>
  );
};

export default SeatMap;