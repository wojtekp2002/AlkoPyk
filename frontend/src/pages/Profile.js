import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Brak tokenu – zaloguj się');
      return;
    }
    try {
      const res = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Błąd pobierania profilu');
    }
  };

  if (!userData) {
    return <div>{message || 'Ładowanie...'}</div>;
  }

  return (
    <div>
      <h2>Profil</h2>
      <p><b>Nazwa użytkownika:</b> {userData.username}</p>
      <p><b>Email:</b> {userData.email}</p>
      <p><b>Punkty:</b> {userData.points}</p>
      {/* Wyświetl inne dane, np. friends */}
    </div>
  );
}

export default Profile;