import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setMessage('Brak tokenu');
      return;
    }
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data);
      fetchPostsForUser(res.data._id);
    } catch (err) {
      setMessage('Błąd profilu');
    }
  };

  const fetchPostsForUser = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPosts(res.data);
    } catch (err) {
      setMessage('Błąd pobierania postów usera');
    }
  };

  if (!userData) {
    return (
      <div className="container my-4">
        {message || 'Ładowanie...'}
      </div>
    );
  }

  const friendsCount = userData.friends?.length || 0;

  return (
    <div className="container col-md-4 my-4">
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
          <div className="mb-3">
            <h5>Znajomi:</h5>
            {userData.friends && userData.friends.length > 0 ? (
              <div className="d-flex flex-wrap">
                {userData.friends.map(friend => (
                  <div 
                    key={friend._id}
                    className="me-3 mb-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/profile/${friend._id}`)}
                  >
                    <span className="badge bg-success">{friend.username}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Brak znajomych</p>
            )}
          </div>
          <div className="text-muted">
            | Punkty: {userData.points || 0}
          </div>
        </div>
      </div>

      <hr/>

      {userPosts.length === 0 ? (
        <p>Brak postów</p>
      ) : (
        <div className="row">
          {userPosts.map()}
        </div>
      )}
      <div className="row">
        {userPosts.map(post => (
          <div key={post._id} className="col-md-4 mb-3">
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
    </div>
  );
}

export default Profile;