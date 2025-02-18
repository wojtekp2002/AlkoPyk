import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Events() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/events', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setEvents(res.data);
    })
    .catch(err => {
      setMessage(err.response?.data?.message || 'Błąd pobierania eventów');
    });
  }, []);

  return (
    <div>
      <h2>Lista Imprez</h2>
      {message && <p>{message}</p>}

      <ul>
        {events.map(ev => (
          <li key={ev._id}>
            <Link to={`/events/${ev._id}`}>
              {ev.title} ({ev.isActive ? 'Aktywna' : 'Zakończona'})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Events;