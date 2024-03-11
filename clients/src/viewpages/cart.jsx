import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import '../styles/shoppingcart.css';
import PreBooking from '../subpages/pre-booking';
import Checkout from '../subpages/checkout';

const Cart = () => {
  const location = useLocation();
  const cartInfo = location?.state?.cartInfo;
  const reservationData = location?.state?.final;

  if (!cartInfo || !reservationData) {
    return <div>No reservation</div>;
  }

  return (
    <div className="shopping-cart">
      <h2 style={{ textAlign: 'center', margin: '2%' }}>Your Shopping Cart</h2>
      <div style={{ maxWidth: '100%', color: 'black' }}>
        <PreBooking movie={cartInfo.selectMovie} bookingInfo={cartInfo.bookingInfo} />
        <h2 style={{ textAlign: 'center', margin: '2%' }}>Checkout</h2>
        <Checkout bookingData={reservationData} />
      </div>
    </div>
  );
};

export default Cart;



// function Cart() {
//     return ( 
//         <div>
            
//         </div>
//      );
// }

// export default Cart;

// import React, { useState } from 'react';
// import '../styles/shoppingcart.css';
// import '../styles/show.css'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
// import React, {useEffect, useState} from 'react';
// import { useParams } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { Booking as bookings} from '../service/booking'
// import { Schedule } from '../service/Schedule'




// const Cart = () => {
//     const [cartItems, setCartItems] = useState([]);
//     const location = useLocation();
//     const movie = location.state.movie;
//     const bookingInfo = location.state.bookingInfo;
//     const addItemToCart = (item) => {
//       setCartItems([...cartItems, item]);
//     };
//     useEffect(()=>{
//       console.log(movie)
//     })
//     const removeItemFromCart = (index) => {
//       const updatedCart = [...cartItems];
//       updatedCart.splice(index, 1);
//       setCartItems(updatedCart);
//     };
  
//     const getTotalPrice = () => {
//       return cartItems.reduce((total, item) => total + item.price, 0);
//     };
    
//     return (
//       <div className="shopping-cart">
//         <h2>Your Shopping Cart</h2>
//         <ul>
//           {cartItems.map((item, index) => (
//             <li key={index}>
//               {item.name} - ${item.price}
//               <button onClick={() => removeItemFromCart(index)}>Remove</button>
//             </li>
//           ))}
//         </ul>
//         <div className="total">
//           <strong>Total:</strong> ${getTotalPrice()}
//         </div>
//         <div>

//         </div>
//       </div>
//     );
//   };
  
//   export default Cart;