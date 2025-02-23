import React, {useState, useRef, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationDropdown from './NotificationDropdown';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Stan do wyszukiwarki
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null); // do wykrywania kliknięć poza dropdownem

  useEffect(() => {
    // Jeżeli searchQuery ma min 1 znak, robimy zapytanie
    if (searchQuery.length > 0) {
      fetchSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchSearch = async () => {
    try {
      if (!token) return;
      const res = await axios.get(`http://localhost:5000/api/users/search?name=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(res.data);
      setShowDropdown(true); // pokazujemy dropdown
    } catch (err) {
      console.error('Błąd wyszukiwania', err);
    }
  };

  // Kliknięcie w usera z listy
  const handleSelectUser = (userId) => {
    setShowDropdown(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/profile/${userId}`);
  };

  // Kliknięcie poza dropdown – zamykamy
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!token) return null;

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark mb-3">
      <div className="container">
        <Link className="navbar-brand" to="/feed"><strong>AlkoPyk</strong></Link>

        {/* SEARCH (input-group) */}
        <div className="ms-3 me-auto position-relative" ref={searchRef}>
          <div className="input-group" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <span className="input-group-text bg-white" style={{ border: 'none' }}>
              <i className="fa fa-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Szukaj znajomych..."
              style={{ border: 'none', borderRadius: 0 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
            />
          </div>

          {/* DROPDOWN z wynikami */}
          {showDropdown && searchResults.length > 0 && (
            <ul 
              className="list-group position-absolute" 
              style={{ top: '42px', left: 0, width: '100%', zIndex: 999 }}
            >
              {searchResults.map((usr) => (
                <li 
                  key={usr._id} 
                  className="list-group-item list-group-item-action"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSelectUser(usr._id)}
                >
                  {usr.username}
                </li>
              ))}
            </ul>
          )}

          {/* Gdy nic nie znaleziono, a query > 0 */}
          {showDropdown && searchQuery.length > 0 && searchResults.length === 0 && (
            <ul 
              className="list-group position-absolute" 
              style={{ top: '42px', left: 0, width: '100%', zIndex: 999 }}
            >
              <li className="list-group-item text-muted">
                Brak wyników
              </li>
            </ul>
          )}
        </div>

        <ul className="navbar-nav ms-auto align-items-center">
          {/* Powiadomienia (dzwonek) */}
          <li className="nav-item dropdown me-3">
            <button 
              className="nav-link btn btn-link dropdown-toggle text-white"
              id="notifDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fa fa-bell fa-lg"></i>
            </button>
            <NotificationDropdown />
          </li>

          {/* Ikona do tworzenia posta */}
          <li className="nav-item me-3">
            <Link className="nav-link" to="/create-post">
              <i className="fa fa-plus fa-lg"></i>
            </Link>
          </li>

          {/* Profil */}
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