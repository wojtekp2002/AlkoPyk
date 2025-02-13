import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev, 
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      setMessage(res.data.message + ' - Użytkownik: ' + res.data.user.username);
      // Otrzymamy też token (res.data.token)
      // Możemy go zapisać w localStorage:
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Błąd');
    }
  };

  return (
    <div>
      <h2>Logowanie</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Hasło:</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Zaloguj</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;