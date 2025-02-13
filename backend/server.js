const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

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
