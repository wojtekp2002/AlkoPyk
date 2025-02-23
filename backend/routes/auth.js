const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const requireAuth = require('../middleware/auths');

const SECRET_KEY = 'supersekretnyklucz'; // w praktyce trzymamy w zmiennych środowiskowych

// Rejestracja
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Sprawdzamy, czy użytkownik już istnieje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Użytkownik z takim mailem już istnieje' });
    }

    // Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzymy nowego użytkownika
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({ message: 'Rejestracja pomyślna' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Logowanie
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Znajdź użytkownika po email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Nieprawidłowe dane logowania' });
    }

    // Porównaj hasła
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Nieprawidłowe dane logowania' });
    }

    // Tworzymy token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

    return res.json({ 
      message: 'Zalogowano',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;