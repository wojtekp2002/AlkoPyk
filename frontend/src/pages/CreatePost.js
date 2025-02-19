import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBarFriends from '../components/SearchBarFriends';

function CreatePost() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    description: '',
    whatWasDrunk: '',
    cost: 0,
    withFriends: '',
    image: '' // tutaj będzie Base64
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const [selectedFriends, setSelectedFriends] = useState([]);

  const handleAddFriend = (user) => {
    // Dodaj do local state
    if (!selectedFriends.some(f => f._id === user._id)) {
      setSelectedFriends([...selectedFriends, user]);
    }
  };

  // Odczyt pliku => Base64
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // Wynik to base64
      setFormData(prev => ({
        ...prev,
        image: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const withFriendsIds = selectedFriends.map(u => u._id);

    if (!token) {
      setMessage('Brak tokenu, zaloguj się!');
      return;
    }
    try {
      const withFriendsArray = formData.withFriends
        .split(',')
        .map(x => x.trim())
        .filter(x => x);

      const res = await axios.post('http://localhost:5000/api/posts/create', {
        description: formData.description,
        whatWasDrunk: formData.whatWasDrunk,
        cost: Number(formData.cost),
        withFriends: withFriendsIds,
        image: formData.image
      }, {headers: { Authorization: `Bearer ${token}` }});

      setMessage(res.data.message || 'Post utworzony!');
      navigate('/feed');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Błąd tworzenia posta');
    }
  };

  return (
    <div className="container col-md-4 mt-4">
      <h2 className="my-3">Dodaj Post</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Opis</label>
          <input 
            type="text"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Co wypito</label>
          <select 
            name="whatWasDrunk"
            className="form-select"
            value={formData.whatWasDrunk}
            onChange={handleChange}
          >
            <option value="">-- Wybierz --</option>
            <option value="Wódka">Wódka</option>
            <option value="Piwo">Piwo</option>
            <option value="Wino">Wino</option>
            <option value="Bimber">Bimber</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Koszt</label>
          <input 
            type="number"
            name="cost"
            className="form-control"
            value={formData.cost}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Oznacz znajomych</label>
          <SearchBarFriends onAddFriend={handleAddFriend} />
          <div className="mt-2">
            {selectedFriends.map(friend => (
              <span key={friend._id} className="badge bg-primary me-2">
                {friend.username}
              </span>
            ))}
          </div>
        </div>

        {/* Wybór pliku */}
        <div className="mb-3">
          <label className="form-label">Zdjęcie (plik)</label>
          <input 
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Dodaj Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;