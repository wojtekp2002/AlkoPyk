import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    // Odesłać do strony wyników, np. /search?query=xyz
    if (!searchQuery) return;
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  if (!token) return null;

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark mb-3">
      <div className="container">
        <Link className="navbar-brand" to="/feed">
          <strong>AlkoPyk</strong>
        </Link>

        {/* Search form */}
        <form className="d-flex me-auto ms-3" onSubmit={handleSearch}>
          <input 
            className="form-control" 
            type="search" 
            placeholder="Szukaj..." 
            aria-label="Szukaj"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-outline-light ms-2" type="submit">
            <i className="fa fa-search"></i>
          </button>
        </form>

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
          <li className="nav-item dropdown me-3">
            <button 
              className="nav-link btn btn-link dropdown-toggle text-white"
              id="notifDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fa fa-bell fa-lg"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="notifDropdown">
              {/* tu mapujesz powiadomienia */}
              <li><a className="dropdown-item" href="#!">Brak powiadomień</a></li>
            </ul>
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