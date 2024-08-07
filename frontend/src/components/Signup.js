import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './styling/Signup.css';

const validateInput = (user) => {
  const { type, name, email } = user;

  if (!type || !name || !email) {
    return 'Type, name, and email are required';
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    return 'Invalid email format';
  }

  return null;
};

const Signup = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [user, setUser] = useState({
    type: '',
    name: '',
    email: ''
  });

  const API_URL = 'https://service-testnet.maschain.com/api/wallet/create-user';
  const CLIENT_ID = 'dcc67b1d4f9c7db2483e7823e14a4bfb28ee87e96abb857e57febbcba16836db';
  const CLIENT_SECRET = 'sk_07bdb646220d6ca9081ab8bead4ea41e2c1f0fb0a7ea2d992faa9f119e5a25ba';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState, [name]: value
    }));
  };

  const getIDLabel = () => {
    return user.type === 'donator' ? 'Donator Name:' : 'School Name:';
  };

  const getIDPlaceholder = () => {
    return user.type === 'donator' ? 'Enter your name' : 'Enter your school name';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInput(user);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      // First request to create user
      const createUserResponse = await axios.post(
        `${API_URL}`,
        user,
        {
          headers: {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
          }
        }
      );
      
      setWalletAddress(createUserResponse.data.result.wallet.wallet_address);

      // Second request to update user with wallet address
      await axios.put(
        `${API_URL}/${user.email}`, // Assuming the endpoint can find the user by email
        { walletAddress },
        {
          headers: {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
          }
        }
      );

      alert('Created account successfully');
      setUser({
        type: '',
        name: '',
        email: ''
      });
    } catch (error) {
      console.error('Error signing up: ', error);
      alert('Failed to sign up: ' + error.message);
    }
  };

  return (
    <div className='Signup-user-wrapper'>
      <div className='Signup-user-body'>
        <div className="Signup-user-container">
          <h1 className='Signup-user-h1'>Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="type"></label>
            <select
              className='Signup-user-select'
              name="type"
              id="type"
              onChange={handleChange}
              value={user.type}>
              <option value="" disabled>Select account type</option>
              <option value="donator">Donator</option>
              <option value="school">School</option>
            </select>

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleChange}
            />

            <label htmlFor="name">{getIDLabel()}</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder={getIDPlaceholder()}
              value={user.name}
              onChange={handleChange}
            />

            <center><button className='Signup-user-button' type="submit">Create Account</button></center>
          </form>
          <center><p className='Signup-user-p'>Already have an account? <Link className='Signup-user-a' to="/login">Sign In</Link></p></center>
        </div>
      </div>
    </div>
  );
}

export default Signup;
