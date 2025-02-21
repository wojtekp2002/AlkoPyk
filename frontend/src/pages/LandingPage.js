import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/feed');
    }
  }, [navigate]);

  return (
    <div className="landing-page-container d-flex flex-column align-items-center justify-content-center">
      <h1 className="text-white display-1 mb-4 fw-bold">AlkoPyk</h1>

      <div className="mb-2">
        <Link to="/login" className="btn btn-light me-3">
          Zaloguj się
        </Link>
      </div>

      <div className="text-white">
        Nie masz konta?{' '}
        <Link to="/register" className="text-warning" style={{ textDecoration: 'underline' }}>
          Zarejestruj się
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;