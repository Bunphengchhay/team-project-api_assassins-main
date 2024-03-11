import '../styles/membership.css'
import { useEffect, useState } from 'react';
import authentication from '../service/authentication';
import Users from '../service/Users';

function Membership() {
  // State to store form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cardNUmber: '',
    csv: ''
  });

  const [auth, setAuth] = useState(null)
  const [isPremiumMember, setPremium] = useState(false);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // You can perform validation here before submitting the data
    // For example, check if all required fields are filled, validate email format, etc.

    // Assuming validation passes, you can send the form data to your server or perform any other action.
    console.log('Form submitted with data:', formData);

    // Reset the form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });

    
    if(auth){
        const userId = auth?.user?._id
        // Call the updatePremiumMembership method to update the premium status
        authentication
        .updatePremiumMembership(userId, "true")
        .then((response) => {
            if (response.ok) {
            // Membership status updated successfully
            console.log('Membership status updated successfully');
            // setPremium(true)
            // Redirect the user to the /Profile page
            window.location = '/Profile'
            } else {
            // Handle errors here
            console.error('Error updating membership status');
            }
        })
        .catch((error) => {
            // Handle network or other unexpected errors
            console.error('Unexpected error:', error);
        });
    }else{
        console.log("Need to Sign up ")
    }

  };
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await authentication.getAuth();
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        // Assuming the server returns JSON data, you can parse it
        const data = await response.json();
        setAuth(data)
        if(data?.authenticated){
            const user = new Users();
            const userInfo = await user.getUser(data?.user?._id);
            console.log(userInfo.json())
        }
        // Now you can work with the parsed JSON data in the 'data' variable
        console.log(data);
      } catch (error) {
        // Handle any errors here
        console.error(error);
      }
    }
  
    fetchData();
  }, []);

  useEffect(()=>{
    console.log(auth?.member?.is_premium)
    if(auth){
      if(auth.member?.is_premium) {
        console.log(auth.member?.is_premium)
        setPremium(true);
      } else {
        setPremium(false);
      }
    }else{
        setPremium(false);
       
    }
  },[isPremiumMember, auth])

  
  if (isPremiumMember) {
    return (
      <div>
        <p>You are already a premium member.</p>
        <p> You may enjoy all the peak and perk we offered </p>
      </div>
    );
  }

  return (
    <div className="center-content">
        
      <h2>Sign up for Premium </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <p> Credit Card </p>
        <div>
          <label htmlFor="cardNumber">Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="csv">CSV:</label>
          <input
            type="text"
            id="csv"
            name="csv"
            value={formData.csv}
            onChange={handleInputChange}
            required
          />
        </div>
        <p> Only $15 to enjoy this premium membership</p>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Membership;
