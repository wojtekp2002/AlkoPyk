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
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPosts(res.data))
    .catch(err => setMessage(err.response?.data?.message || 'Błąd pobierania postów'));
  }, [token]);

  const refreshPosts = () => {
    axios.get('http://localhost:5000/api/posts', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPosts(res.data))
    .catch(err => setMessage('Błąd odświeżania postów'));
  };

  // Lajk
  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      refreshPosts();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Błąd lajkowania');
    }
  };

  return (
    <div className="container card mb-4 shadow-sm">
      <h2 className="my-3"></h2>
      {message && <div className="alert alert-info">{message}</div>}

      {posts.map(post => (
        <PostItem
          key={post._id}
          post={post}
          token={token}
          onLike={() => handleLike(post._id)}
          onRefresh={refreshPosts}
        />
      ))}
    </div>
  );
}

// Komponent pojedynczego posta
function PostItem({ post, token, onLike, onRefresh }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          <img 
            src="https://via.placeholder.com/40"
            alt="avatar"
            className="rounded-circle me-2"
          />
          <strong>{post.author?.username}</strong>
        </div>

        {/* Opis posta */}
        <p>{post.description}</p>
        {post.image && (
          <img 
            src={post.image}
            alt="post-img"
            className="img-fluid mb-3"
          />
        )}

        {/* Ikony lajka i komentarza, obok liczby */}
        <div className="d-flex align-items-center">
          <button 
            onClick={onLike}
            className="btn btn-sm btn-light me-3 d-flex align-items-center"
          >
            <i className="fa fa-heart text-danger me-1"></i>
            <span>{post.likedBy?.length || 0}</span>
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className="btn btn-sm btn-light d-flex align-items-center"
          >
            <i className="fa fa-comment me-1"></i>
            <span>{post.comments?.length || 0}</span>
          </button>
        </div>

        {/* Sekcja komentarzy – widoczna po kliknięciu w dymek */}
        {showComments && (
          <div className="mt-3">
            <ul className="list-group">
              {post.comments?.map(comment => (
                <li key={comment._id} className="list-group-item">
                  <strong>{comment.user?.username}</strong>: {comment.text}
                </li>
              ))}
            </ul>

            {/* Formularz dodawania komentarza */}
            <CommentForm postId={post._id} token={token} onSuccess={onRefresh} />
          </div>
        )}
      </div>
    </div>
  );
}

// Formularz komentarza
function CommentForm({ postId, token, onSuccess }) {
  const [text, setText] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText('');
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleAddComment} className="mt-2 d-flex">
      <input 
        type="text"
        className="form-control me-2"
        placeholder="Dodaj komentarz..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">Wyślij</button>
    </form>
  );
}

export default Feed;