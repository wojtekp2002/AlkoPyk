const express = require('express');
const app = express();
const cors = require('cors');

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