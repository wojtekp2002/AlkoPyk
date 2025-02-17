const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auths');
const User = require('../models/user-model');

router.post('/add-friend', requireAuth, async (req, res) => {
    try {
      // Zakładamy, że w body przychodzi np. { friendId: '...'}
      const { friendId } = req.body;
  
      // Odnajdowanie użytkownika, który chce dodać znajomego
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
      }
  
      const friendUser = await User.findById(friendId);
      if (!friendUser) {
        return res.status(404).json({ message: 'Znajomy nie znaleziony' });
      }
  
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: 'Już dodałeś tego użytkownika do znajomych' });
      }
  
      // Dodanie friendId do tablicy friends
      user.friends.push(friendId);
      await user.save();
  
      return res.json({ message: 'Dodano do znajomych' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
  });
  
  module.exports = router;