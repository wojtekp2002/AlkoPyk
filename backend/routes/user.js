const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auths');
const User = require('../models/user-model');

// Ten endpoint
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password') // wykluczamy hasło
      .populate('friends', 'username'); // jeśli chcesz mieć listę znajomych z username

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});

router.get('/search', requireAuth, async (req, res) => {
  try {
    const { name } = req.query; // np. ?name=Jan
    // Szukaj po username (case-insensitive?)
    const users = await User.find({
      username: { $regex: name, $options: 'i' }
    }).select('username'); // Tylko username i _id

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Błąd wyszukiwania' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('friends', 'username');
    if (!user) return res.status(404).json({ message: 'Nie znaleziono usera' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu usera' });
  }
});

module.exports = router;