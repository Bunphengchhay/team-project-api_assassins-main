import { createContext, useContext, useState } from 'react';

const TheaterContext = createContext();

export const useTheaterContext = () => {
  return useContext(TheaterContext);
};

export const TheaterProvider = ({ children }) => {
  const [closestTheaterInfo, setClosestTheaterInfo] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const setTheaterInfo = (theaterInfo) => {
    setClosestTheaterInfo(theaterInfo);
  };

  return (
    <TheaterContext.Provider value={{ closestTheaterInfo, setTheaterInfo }}>
      {children}
    </TheaterContext.Provider>
  );
};


const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};
