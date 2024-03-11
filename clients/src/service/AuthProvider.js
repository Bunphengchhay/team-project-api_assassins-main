// AuthenticationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import server from './server_fetcher';

const AuthenticationContext = createContext();

export function useAuth() {
  return useContext(AuthenticationContext);
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null); // Initially set to null or initial user data
  
  useEffect(() => {
    // Fetch user authentication status here and set it in the `auth` state
    // Example: Check if the user is authenticated and fetch user data
    // If authenticated, set user data in `auth` state
    // If not authenticated, set `auth` to null
    const fetchUserAuthentication = async () => {
      try {
        const response = await server.fetch('auth'); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          setAuth(data);
        } else {
          setAuth(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuth(null);
      }
    };

    fetchUserAuthentication();
  }, []);

  return (
    <AuthenticationContext.Provider value={auth}>
      {children}
    </AuthenticationContext.Provider>
  );
}
