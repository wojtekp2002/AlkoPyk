import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams(); // -> /profile/:userId
  const token = localStorage.getItem('token');

  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setMessage('Brak tokenu');
      return;
    }
    fetchUserData();
  }, [token, userId]);

  const fetchUserData = async () => {
    try {
      const resUser = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(resUser.data);

      // Posty usera:
      const resPosts = await axios.get(`http://localhost:5000/api/posts?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPosts(resPosts.data);

    } catch (err) {
      setMessage('Błąd pobierania cudzego profilu');
    }
  };

  if (!userData) {
    return (
      <div className="container my-4 col-md-4">
        {message || 'Ładowanie...'}
      </div>
    );
  }

  const friendsCount = userData.friends?.length || 0;

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
            Znajomi: {friendsCount} | Punkty: {userData.points || 0}
          </div>
        </div>
      </div>

      {/* Znajomi cudzego profilu (opcjonalnie) */}
      {friendsCount > 0 ? (
        <div className="d-flex flex-wrap mb-3">
          {userData.friends.map(friend => (
            <div key={friend._id} className="me-2 text-primary">
              {friend.username}
            </div>
          ))}
        </div>
      ) : (
        <p>Brak znajomych</p>
      )}

      {/* Posty usera */}
      {userPosts.length === 0 ? (
        <p>Brak postów</p>
      ) : (
        <div className="row">
          {userPosts.map(post => (
            <div key={post._id} className="col-12 mb-3">
              <div className="card">
                {post.image && (
                  <img
                    src={post.image}
                    alt="post-img"
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <p>{post.description}</p>
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