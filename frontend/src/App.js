import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';  

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      {token && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;