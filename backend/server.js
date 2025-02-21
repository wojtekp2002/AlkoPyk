const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/add-friend');
const postRoutes = require('./routes/post');
const eventRoutes = require('./routes/event');
const profileRoutes = require('./routes/user')
const notifRoutes = require('./routes/notifications');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Middleware
app.use(express.json()); // pozwala na parsowanie JSON w body requestu

// Testowa trasa
app.get('/', (req, res) => {
  res.send('No elo elo!');
});

const PORT = 5000;
// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//db
mongoose.connect('mongodb://localhost:27017/alko-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Połączono z MongoDB');
  })
  .catch(err => {
    console.error('Błąd połączenia z MongoDB:', err);
  });

//auth
app.use('/api/auth', authRoutes);

//add-friend
app.use('/api/users', userRoutes);

//event
app.use('/api/events', eventRoutes);

//posty
app.use('/api/posts', postRoutes);

//profil
app.use('/api/profile', profileRoutes);

//powiadomienia
app.use('/api/notifications', notifRoutes);