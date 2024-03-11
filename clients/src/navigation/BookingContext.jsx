import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBookingContext = () => {
  return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

  const setUserDetailsInfo = (bookingDetails) => {
    setUserDetails(bookingDetails);
  };

  return (
    <BookingContext.Provider value={{ userDetails, setUserDetailsInfo }}>
      {children}
    </BookingContext.Provider>
  );
};
