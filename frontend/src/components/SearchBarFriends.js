import React, { useState } from 'react';
import axios from 'axios';

function SearchBarFriends({ onAddFriend }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const token = localStorage.getItem('token');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/users/search?name=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClick = (user) => {
    // np. wywołujemy onAddFriend, który doda user._id do tablicy
    onAddFriend(user);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="d-flex mb-2">
        <input 
          type="text"
          className="form-control me-2"
          placeholder="Szukaj znajomych..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary">Szukaj</button>
      </form>

      <ul className="list-group">
        {results.map(user => (
          <li key={user._id} className="list-group-item d-flex justify-content-between">
            <span>{user.username}</span>
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleAddClick(user)}
            >
              Dodaj
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBarFriends;