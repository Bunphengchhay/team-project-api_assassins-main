//import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './navigation/navigation';
import { BrowserRouter, Router, Routes } from 'react-router-dom';
import React from 'react';
import { AuthProvider } from './service/AuthProvider';

import AppRoutes from './navigation/appRoutes';
import Footer from './viewpages/footer';
import { AuthenticationProvider } from './service/AuthenticationProvider';
import TopBar from './navigation/topBar';

function App() {
  return (
    <div className="App-Main">
       <AuthenticationProvider>
          <TopBar/>
          <Navigation />
          <div className="content">
            <AppRoutes/>
          </div>
      </AuthenticationProvider>
      <footer>
        <Footer/>
      </footer>

    </div>
  );
}

export default App;

