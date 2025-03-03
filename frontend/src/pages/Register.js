import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
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
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage(res.data.message || 'Rejestracja pomyślna!');
      navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Błąd rejestracji');
    }
  };

  return (
    <div className="auth-container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="col-md-4">

        <h2 
          className="text-center"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <strong>ALKO APP</strong>
        </h2>

        <div className="auth-card p-4">
          <h2 className="mb-4">Rejestracja</h2>
          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nazwa użytkownika</label>
              <input 
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Hasło</label>
              <input 
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-success w-100 mt-2">
              Zarejestruj
            </button>

            <p className="mt-2 text-center">
              Masz już konto? <Link to="/login">Zaloguj się</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;