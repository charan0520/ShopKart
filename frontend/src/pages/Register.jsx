import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the request body
    const requestBody = {
      name: username,
      email: email,
      password: password,
    };

    try {
      // Send the POST request
      const response = await axios.post('http://localhost:8080/users/api/users', requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle the response
      if (response.data.length == 0) {
        toast.error('Registration failed');
      } else {
        toast.success('Registration successful');
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error('Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
