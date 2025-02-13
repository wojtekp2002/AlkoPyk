import React, { useState, useEffect } from 'react';
import Register from './Register';
import Login from './Login';

function App() {
  const [view, setView] = useState('register');

  return (
    <div>
      <h1>Moja Aplikacja Alko</h1>
      <button onClick={() => setView('register')}>Rejestracja</button>
      <button onClick={() => setView('login')}>Logowanie</button>

      {view === 'register' && <Register />}
      {view === 'login' && <Login />}
    </div>
  );
}

export default App;

