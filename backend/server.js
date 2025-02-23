const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user'); // scalony plik user.js
const postRoutes = require('./routes/post');
const eventRoutes = require('./routes/event');
const notifRoutes = require('./routes/notifications');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Testowa
app.get('/', (req, res) => {
  res.send('Skibidi');
});

mongoose.connect('mongodb://localhost:27017/alko-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Połączono z MongoDB');
})
.catch(err => {
  console.error('Błąd połączenia z MongoDB:', err);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Rejestracja / Logowanie
app.use('/api/auth', authRoutes);

// Użytkownicy (profil, add-friend, search, /:id)
app.use('/api/users', userRoutes);

// Posty
app.use('/api/posts', postRoutes);

// Eventy
app.use('/api/events', eventRoutes);

// Powiadomienia
app.use('/api/notifications', notifRoutes);