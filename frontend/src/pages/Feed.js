import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Brak tokenu, zaloguj się!');
      return;
    }

    axios.get('http://localhost:5000/api/posts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setPosts(res.data);
    })
    .catch(err => {
      setMessage(err.response?.data?.message || 'Błąd pobierania postów');
    });
  }, []);

  return (
    <div>
      <h2>Feed</h2>
      {message && <p>{message}</p>}
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <strong>Autor:</strong> {post.author?.username} <br/>
            Opis: {post.description} <br/>
            Co wypito: {post.whatWasDrunk} <br/>
            Koszt: {post.cost} <br/>
            <hr/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Feed;