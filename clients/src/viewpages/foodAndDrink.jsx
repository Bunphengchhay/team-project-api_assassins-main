// function foodAndDrink() {
//     return ( 
//         <div>
//         </div>
//      );
// }

// export default foodAndDrink;

import React, { useState } from 'react';
import '../styles/foodanddrinks.css';

const FoodAndDrink = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Popcorn', type: 'Food', price: 10.99 },
    { id: 2, name: 'Hotdog', type: 'Food', price: 5.99 },
    { id: 3, name: 'Coke', type: 'Drink', price: 2.99 },
    { id: 4, name: 'Diet Coke', type: 'Drink', price: 3.99 },
  ]);

  const [orderItems, setOrderItems] = useState([]);

  const addToOrder = (item) => {
    setOrderItems([...orderItems, item]);
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="food-and-drink">
      <h2> Food and Drinks </h2>
      
      <div className="menu">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item">
            <span className="item-name">{item.name}</span>
            <span className="item-price">${item.price}</span>
            <button onClick={() => addToOrder(item)}>Add to Order</button>
          </div>
        ))}
      </div>
      <div className="order-summary">
        <h3>Your Order</h3>
        <ul>
          {orderItems.map((orderItem, index) => (
            <li key={index}>
              {orderItem.name} - ${orderItem.price}
            </li>
          ))}
        </ul>
        <div className="total">
          <strong>Total:</strong> ${getTotalPrice()}
        </div>
      </div>
    </div>
  );
};

export default FoodAndDrink;
