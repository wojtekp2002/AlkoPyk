import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
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
  }, [token]);

  // Funkcja do polubienia posta
  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      // Odśwież posty
      refreshPosts();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Błąd lajkowania');
    }
  };

  // Funkcja do odświeżania postów
  const refreshPosts = () => {
    axios.get('http://localhost:5000/api/posts', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPosts(res.data))
    .catch(err => setMessage('Błąd odświeżania postów'));
  };

  return (
    <div>
      <h2>Feed</h2>
      {message && <p>{message}</p>}

      <ul>
        {posts.map(post => {
          return (
            <li key={post._id} style={{ marginBottom: '20px' }}>
              <strong>Autor:</strong> {post.author?.username} <br/>
              Opis: {post.description} <br/>
              Co wypito: {post.whatWasDrunk} <br/>
              Koszt: {post.cost} <br/>
              <br/>

              <div>
                <button onClick={() => handleLike(post._id)}>
                  Polub / Odlub
                </button>
                <span>: {post.likedBy ? post.likedBy.length : 0}</span>
              </div>

              <div style={{ marginTop: '10px' }}>
                <b>Komentarze:</b>
                <ul>
                  {post.comments?.map((comment) => (
                    <li key={comment._id}>
                      <i>UserID: {comment.user}</i> - {comment.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formularz dodania komentarza */}
              <CommentForm postId={post._id} onSuccess={refreshPosts} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Komponent wewnętrzny do dodawania komentarza
function CommentForm({ postId, onSuccess }) {
  const token = localStorage.getItem('token');
  const [text, setText] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, 
        { text }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText('');
      if (onSuccess) onSuccess(); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleAddComment} style={{ marginTop: '5px' }}>
      <input 
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Napisz komentarz..."
      />
      <button type="submit">Dodaj komentarz</button>
    </form>
  );
}

export default Feed;