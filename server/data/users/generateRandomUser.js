const bcrypt = require('bcrypt');
const faker = require('faker');
const fs = require('fs');

const { User } = require('./models/user'); // Import your user model

const createUser = async (name, email, phone_number, password, member) => {
  try {
    // Hash the provided password
    const saltRounds = 10;
    const password_hashed = await bcrypt.hash(password, saltRounds);

    // Create a new user document with the hashed password
    const newUser = new User({
      name,
      email,
      phone_number,
      password_hashed,
      member,
    });

    // Save the user document to the database
    await newUser.save();
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

const generateRandomUsers = async () => {
    // Generate random user data for 10 users
    const userData = Array.from({ length: 10 }, () => ({
      name: faker.name.findName(),
      email: faker.internet.email(),
      phone_number: faker.phone.phoneNumberFormat(),
      password: 'testPassword123456789', // Replace with the actual password you want to use
      member: {
        is_premium: false,
        reward: faker.random.number({ min: 100, max: 1000 }), // Random reward value
        payment_info: {
          account: faker.finance.account(), // Random account number
          security_code_hashed: bcrypt.hashSync('123', 10), // Replace with the actual security code
          account_holder: faker.name.findName(),
          expiry: faker.date.future().toISOString(),
        },
      },
    }));
  
    // Loop through the generated user data and create users
    for (const user of userData) {
      await createUser(user.name, user.email, user.phone_number, user.password, user.member);
    }
  
    // Save the user data to a JSON file
    const jsonUserData = JSON.stringify(userData, null, 2); // Pretty-print JSON with 2 spaces
    fs.writeFileSync('randomUserData.json', jsonUserData);
  
    console.log('Users created successfully and saved to randomUserData.json');
  };
  
  // Call the function to generate random users and save them to a JSON file
  generateRandomUsers();
  

