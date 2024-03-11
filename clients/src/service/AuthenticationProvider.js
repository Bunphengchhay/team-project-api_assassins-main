// AuthenticationProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import authentication from "./authentication";


const AuthenticationContext = createContext();

export const useAuth = () => {
  return useContext(AuthenticationContext);
};

export const AuthenticationProvider = ({ children }) => {
  const [user, setAuth] = useState(null); // User information and authentication status

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const response = await authentication.getAuth();
        if (response.status === 200) {
          const user = await response.json();
          setAuth(user);
        } else {
          setAuth(null);
        }
      } catch (error) {
        setAuth(null);
      }
    }

    checkAuthentication();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authentication.tryLogin(email, password);
      if (response.status === 200) {
        const user = await response.json();
        setAuth(user);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const response = await authentication.tryRegister(name, email, phone, password);
      if (response.status === 200) {
        const user = await response.json();
        setAuth(user);
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await authentication.tryLogout();
      if (response.status === 200) {
        setAuth(null);
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthenticationContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
