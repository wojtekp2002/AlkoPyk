import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    axios.get('http://localhost:5000/api/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setNotifications(res.data);
    })
    .catch(err => console.error('Błąd powiadomień', err));
  }, [token]);

  const handleAccept = async (notifId) => {
    try {
      await axios.post(`http://localhost:5000/api/notifications/${notifId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Odśwież listę
      const updated = notifications.filter(n => n._id !== notifId);
      setNotifications(updated);
    } catch (err) {
      console.error('Błąd akceptowania', err);
    }
  };

  if (!notifications.length) {
    return (
      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="notifDropdown">
        <li><span className="dropdown-item">Brak powiadomień</span></li>
      </ul>
    );
  }

  return (
    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="notifDropdown">
      {notifications.map(notif => (
        <li key={notif._id} className="dropdown-item">
          <span>
            {notif.type === 'friendRequest'
              ? `Użytkownik ${notif.sender?.username} zaprasza Cię do znajomych`
              : `Użytkownik ${notif.sender?.username} zaprasza Cię na imprezę`}
          </span>
          <button 
            className="btn btn-sm btn-success ms-2"
            onClick={() => handleAccept(notif._id)}
          >
            Akceptuj
          </button>
        </li>
      ))}
    </ul>
  );
}

export default NotificationDropdown;