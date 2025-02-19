import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!token) return null; // Gdy nie ma tokenu, nie wyświetlamy navbaru

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark mb-3">
      <div className="container">
        <Link className="navbar-brand" to="/feed">
          <strong>AlkoPyk</strong>
        </Link>

        <ul className="navbar-nav ms-auto align-items-center">
          {/* Ikona Home */}
          <li className="nav-item me-3">
            <Link className="nav-link" to="/feed">
              <i className="fa fa-home fa-lg"></i>
            </Link>
          </li>

          {/* Ikona plus do tworzenia posta */}
          <li className="nav-item me-3">
            <Link className="nav-link" to="/create-post">
              <i className="fa fa-plus fa-lg"></i>
            </Link>
          </li>

          {/* Ikona imprez/powiadomień */}
          <li className="nav-item me-3">
            <Link className="nav-link" to="/events">
              <i className="fa fa-bell fa-lg"></i>
            </Link>
          </li>

          {/* Profil (dropdown) */}
          <li className="nav-item dropdown">
            <button
              className="nav-link btn btn-link dropdown-toggle d-flex align-items-center text-white"
              id="navbarDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fa fa-user-circle fa-lg me-1"></i>
              {user.username || 'Profil'}
            </button>

            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li>
                <Link className="dropdown-item" to="/profile">
                  Mój profil
                </Link>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Wyloguj
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;