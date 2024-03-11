import React, { useEffect, useState } from 'react';
import '../styles/checkout.css'
import { Booking } from '../service/booking';
import { Navigate, useNavigate } from 'react-router-dom';

function CheckoutForm({reservationId}) {
    const [paymentOption, setPaymentOption] = useState('creditCard'); // Default to Credit Card
    const [formValid, setFormValid] = useState(false);
    const booking = new Booking();
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const navigate = useNavigate();
    const bookingId= reservationId[0]

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        email: '',
        zipCode: '',
        cardNumber: '',
        cardName: '',
        csvCode: '',
        cardZipCode: '',
    });
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkFormValidity = () => {
    // Check if all required fields are filled (you can add more validation as needed)
    const requiredFields = [
      'firstName',
      'lastName',
      'address',
      'phone',
      'email',
      'zipCode',
      'cardNumber',
      'cardName',
      'csvCode',
      'cardZipCode',
    ];

    const isFormValid = requiredFields.every((field) => !!formData[field]);
    setFormValid(isFormValid);
  };

// Assuming you have an asynchronous function to handle the response
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const { cardNumber, csvCode } = formData;
    const reservationId = bookingId
    const response = await booking.updatePaymentInfo(reservationId, cardNumber, csvCode);

    if (response && response.success) { // Check for 'success' property
      console.log('Payment information updated successfully');
      setPaymentSuccess(true);
      navigate('/Success');
    } else {
      if (response) {
        console.error('Error updating payment information:', response.message);
      } else {
        console.error('No response received from the server');
      }
    }
  } catch (error) {
    console.error('Error handling form submission:', error);
  }
};




  
  
  
  

  // Check form validity whenever formData changes
  React.useEffect(() => {
    checkFormValidity();
  }, [formData]);


  const handlePaymentOptionChange = (e) => {
    setPaymentOption(e.target.value);
  };

 const reservationData1 = {
      buyerId: '655ea97fab286d0eb25d3b5e',
      purchaseDateTime: new Date(),
      moviePass: {
        movieScreening: '6556b537c1378d306dee946e',
        tickets: [
          {
            assignedSeat: "A4",
            price: 15,
            tax: 1.5,
          },
        ],
      },
      discount: 0,
      service_fee: 1.5,
      status: 'temporary', // Set as 'temporary'
    };

  return (
    <div>
        {/* <button onClick = {handleReservation}> </button> */}
        <div className="checkout-form">
            <div className='section'>
                <p> Billing Information </p>
                <div className="form-group">
                    {/* <label htmlFor="firstName">First Name</label> */}
                    <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    {/* <label htmlFor="lastName">Last Name</label> */}
                    <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    {/* <label htmlFor="address">Address</label> */}
                    <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    {/* <label htmlFor="phone">Phone</label> */}
                    <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    {/* <label htmlFor="email">Email</label> */}
                    <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    {/* <label htmlFor="zipCode">Zip Code</label> */}
                    <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleChange}
                    />
                </div>
        </div>
        <div className='section'>
            <p> Payment </p>
            {/* <div className='creditcard'>
                <div className='creditCard-radio'>
                <label>
                    <input
                    type="radio"
                    name="paymentOption"
                    value="creditCard"
                    checked={paymentOption === 'creditCard'}
                    onChange={handlePaymentOptionChange}
                    />
                    Credit card
                </label>
                </div>
                <div className='creditCard-radio'>
                <label>
                    <input
                    type="radio"
                    name="paymentOption"
                    value="debitCard"
                    checked={paymentOption === 'debitCard'}
                    onChange={handlePaymentOptionChange}
                    />
                    Debit card
                </label>
                </div>
                <div className='creditCard-radio'>
                <label>
                    <input
                    type="radio"
                    name="paymentOption"
                    value="paypal"
                    checked={paymentOption === 'paypal'}
                    onChange={handlePaymentOptionChange}
                    />
                    Paypal
                </label>
                </div>
            </div> */}
            <div className="form-group">
                {/* <label htmlFor="cardNumber">Credit Card Number</label> */}
                <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="Credit Card Number"
                value={formData.cardNumber}
                onChange={handleChange}
                />
            </div>
            <div className="form-group">
                {/* <label htmlFor="cardName">Name on Credit Card</label> */}
                <input
                type="text"
                id="cardName"
                name="cardName"
                placeholder="Name on Credit Card"
                value={formData.cardName}
                onChange={handleChange}
                />
            </div>
            <div className="form-group">
                {/* <label htmlFor="csvCode">CSV Code</label> */}
                <input
                type="text"
                id="csvCode"
                name="csvCode"
                placeholder="CSV Code"
                value={formData.csvCode}
                onChange={handleChange}
                />
            </div>
            <div className="form-group">
                {/* <label htmlFor="cardZipCode">Card Zip Code</label> */}
                <input
                type="text"
                id="cardZipCode"
                name="cardZipCode"
                placeholder="Card Zip Code"
                value={formData.cardZipCode}
                onChange={handleChange}
                />
            </div>
        </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '10%'}}>
            <button style={{borderRadius: '5px', backgroundColor: '#A30000'}}
            type="button"
            onClick={handleSubmit}
            disabled={!formValid} // Disable the button if the form is not valid
            > Submit </button>
        </div>
    </div>
  );
}

export default CheckoutForm;
