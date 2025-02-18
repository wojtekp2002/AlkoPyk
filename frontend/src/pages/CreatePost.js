import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    whatWasDrunk: '',
    cost: 0,
    withFriends: '',
    image: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Brak tokenu, zaloguj się!');
      return;
    }

    try {
      // prosta logika rozdzielenia "withFriends" po przecinkach
      const withFriendsArray = formData.withFriends
        .split(',')
        .map(item => item.trim())
        .filter(item => item);

      const res = await axios.post('http://localhost:5000/api/posts/create', {
        description: formData.description,
        whatWasDrunk: formData.whatWasDrunk,
        cost: Number(formData.cost),
        withFriends: withFriendsArray,
        image: formData.image
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(res.data.message);
      navigate('/feed');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Błąd tworzenia posta');
    }
  };

  return (
    <div>
      <h2>Dodaj Nowy Post</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Opis:</label>
          <input 
            type="text" 
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Co wypito:</label>
          <input 
            type="text" 
            name="whatWasDrunk"
            value={formData.whatWasDrunk}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Koszt:</label>
          <input 
            type="number" 
            name="cost"
            value={formData.cost}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Ze znajomymi (ID,ID):</label>
          <input 
            type="text" 
            name="withFriends"
            value={formData.withFriends}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Obraz (Base64/URL):</label>
          <input 
            type="text" 
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Dodaj Post</button>
      </form>
    </div>
  );
}

export default CreatePost;