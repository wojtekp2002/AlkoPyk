import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Usuwamy token z localStorage, cofnij w razie potrzeby usera
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Czy jesteśmy zalogowani? Sprawdzamy, czy jest token
  const token = localStorage.getItem('token');

  return (
    <nav style={{ display: 'flex', gap: '1rem', background: '#ccc', padding: '10px' }}>
      <Link to="/">Home</Link>

      {/* Jeśli mamy token, możemy pokazywać różne linki */}
      {token ? (
        <>
          <Link to="/feed">Feed</Link>
          <Link to="/create-post">Utwórz Post</Link>
          <Link to="/events">Events</Link>
          <Link to="/profile">Profil</Link>
          <button onClick={handleLogout}>Wyloguj</button>
        </>
      ) : (
        <>
          <Link to="/login">Logowanie</Link>
          <Link to="/register">Rejestracja</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;