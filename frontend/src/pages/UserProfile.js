import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function UserProfile() {
  const { userId } = useParams();
  const token = localStorage.getItem('token');

  const [userData, setUserData] = useState(null);   // dane cudzego profilu
  const [userPosts, setUserPosts] = useState([]);   // posty cudzego usera
  const [myData, setMyData] = useState(null);       // mój profil (z /profile)
  const [friendStatus, setFriendStatus] = useState('none');
  const [message, setMessage] = useState('');
  const [showFriends, setShowFriends] = useState(false); // do modala

  useEffect(() => {
    if (!token) {
      setMessage('Brak tokenu');
      return;
    }
    fetchData();
  }, [token, userId]);

  const fetchData = async () => {
    try {
      // 1) pobierz cudzy profil
      const resUser = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(resUser.data);

      // 2) pobierz posty cudzego usera
      const resPosts = await axios.get(`http://localhost:5000/api/posts?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPosts(resPosts.data);

      // 3) pobierz mój profil
      const resMe = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyData(resMe.data);

      // ustal friendStatus
      if (resMe.data._id === userId) {
        setFriendStatus('self');
      } else if (resMe.data.friends.some(fid => fid.toString() === userId)) {
        // juz jest w moich friends
        setFriendStatus('friends');
      } else {
        // sprawdzic, czy juz wyslano zaproszenie (pending)? - ciezko bez osobnego endpointu
        // ale jesli chcesz, mozesz sprawdzic w powiadomieniach
        setFriendStatus('none');
      }
    } catch (err) {
      setMessage('Błąd pobierania profilu');
    }
  };

  const handleAddFriend = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/add-friend', {
        friendId: userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriendStatus('pending'); 
    } catch (err) {
      console.error('Błąd wysyłania zaproszenia', err);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/remove-friend', {
        friendId: userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // ponowne pobranie me
      const resMe = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyData(resMe.data);
      if (!resMe.data.friends.some(fid => fid.toString() === userId)) {
        setFriendStatus('none');
      }
    } catch (err) {
      console.error('Błąd usuwania znajomego', err);
    }
  };

  if (!userData) {
    return <div className="container my-4 col-md-4">{message || 'Ładowanie...'}</div>;
  }

  const friendsCount = userData.friends?.length || 0;

  // RENDER
  return (
    <div className="container my-4 col-md-4">
      {message && <div className="alert alert-info">{message}</div>}

      <div className="d-flex align-items-center mb-4">
        <img
          src="https://via.placeholder.com/80"
          alt="avatar"
          className="rounded-circle me-3"
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        />
        <div>
          <h4>{userData.username}</h4>
          <div className="text-muted">
            {/* KLikalna liczba znajomych */}
            <span 
              style={{ cursor: 'pointer' }}
              onClick={() => setShowFriends(true)}
            >
              Znajomi: {friendsCount}
            </span>
            {' '} | Punkty: {userData.points || 0}
          </div>
        </div>
      </div>

      {/* MODAL znajomych cudzego usera */}
      {showFriends && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Znajomi {userData.username}</h5>
                <button type="button" className="btn-close" onClick={() => setShowFriends(false)}></button>
              </div>
              <div className="modal-body">
                {friendsCount === 0 ? (
                  <p>Brak znajomych</p>
                ) : (
                  userData.friends.map(fr => (
                    <div key={fr._id} className="mb-2 text-primary">
                      {fr.username}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRZYCISK STANOW */}
      {friendStatus === 'self' ? (
        <p>To Twój profil</p>
      ) : friendStatus === 'friends' ? (
        <button className="btn btn-danger mb-3" onClick={handleRemoveFriend}>
          Usuń ze znajomych
        </button>
      ) : friendStatus === 'pending' ? (
        <button className="btn btn-secondary mb-3" disabled>
          Zaproszenie wysłane...
        </button>
      ) : (
        <button className="btn btn-primary mb-3" onClick={handleAddFriend}>
          Dodaj do znajomych
        </button>
      )}

      {userPosts.length === 0 ? (
        <p>Brak postów</p>
      ) : (
        <div className="row">
          {userPosts.map(p => (
            <div key={p._id} className="col-12 mb-3">
              <div className="card">
                {p.image && (
                  <img
                    src={p.image}
                    alt="post-img"
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <p>{p.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProfile;