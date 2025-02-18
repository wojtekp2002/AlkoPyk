import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div>
        {/* Navbar wyświetlany na każdej stronie */}
        <Navbar />

        <Routes>
          <Route path="/" element={<h2>Strona główna</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/profile" element={<Profile />} />

          {/* Możesz dodać inne ścieżki */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

