import { BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';

import HomePage from "../viewpages/homepage";
import Show from '../viewpages/shows';
import Booking from '../viewpages/booking';
import ContactUs from '../viewpages/contactus';
import Faqs from '../viewpages/faqs';
import Membership from '../viewpages/memebership';
import Cart from '../viewpages/cart';
import Locations from '../viewpages/Locations';
import FoodAndDrink from '../viewpages/foodAndDrink';
import Profile from '../viewpages/profile';
import Logout from '../viewpages/Logout';
import Login from '../viewpages/Login';
import ForgotPassword from '../viewpages/forgotPassword';
import Dashboard from '../viewpages/Dashboard';
import Navigation from './navigation';
import Success from '../subpages/sucess';
// import TopBar from './topBar';
// import { useNavigate } from 'react-router-dom';

function AppRoutes() {
  // const navigate = useNavigate(); // Get the navigate function
  return (
    // <Router>
    //   <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Home" element={<HomePage/>} />
        <Route path="/Show" element={<Show />} />
        <Route path="/booking/:title" element={<Booking />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/Faqs" element={<Faqs />} />
        <Route path="/Membership" element={<Membership />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Locations" element={<Locations />} />
        <Route path="/FoodAndDrink" element={<FoodAndDrink />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/Success" element={<Success/>} />
        
      </Routes>
    // </Router>
  );
}

export default AppRoutes;
