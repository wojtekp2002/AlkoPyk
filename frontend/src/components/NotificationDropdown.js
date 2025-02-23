import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token'); // TU definiujemy `token`

  useEffect(() => {
    if (!token) return;
    axios.get('http://localhost:5000/api/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setNotifications(res.data))
    .catch(err => console.error('Błąd powiadomień', err));
  }, [token]);

  const handleAccept = async (notifId) => {
    try {
      await axios.post(`http://localhost:5000/api/notifications/${notifId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => prev.filter(n => n._id !== notifId));
    } catch (err) {
      console.error('Błąd akceptowania powiadomienia', err);
    }
  };

  const handleReject = async (notifId) => {
    try {
      await axios.post(`http://localhost:5000/api/notifications/${notifId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Po odrzuceniu też usuwamy z listy
      setNotifications(prev => prev.filter(n => n._id !== notifId));
    } catch (err) {
      console.error('Błąd odrzucania powiadomienia', err);
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
      {notifications.map((notif) => (
        <li key={notif._id} className="dropdown-item">
          {notif.type === 'friendRequest' && (
            <div>
              <span>
                {notif.sender?.username} zaprasza Cię do znajomych
              </span>
              <div className="mt-1">
                <button 
                  className="btn btn-sm btn-success me-2"
                  onClick={() => handleAccept(notif._id)}
                >
                  Akceptuj
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleReject(notif._id)}
                >
                  Odrzuć
                </button>
              </div>
            </div>
          )}
          {notif.type !== 'friendRequest' && (
            <div>
              {/* Inne typy powiadomień, np. eventInvite */}
              <span>{notif.message}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default NotificationDropdown;