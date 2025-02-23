const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auths');
const User = require('../models/user-model');


router.post('/add-friend', requireAuth, async (req, res) => {
  try {
    const { friendId } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Nie znaleziono użytkownika (ciebie)' });
    }
    if (friendId === req.userId) {
      return res.status(400).json({ message: 'Nie możesz dodać siebie do znajomych' });
    }

    // Sprawdzamy, czy już w moich friends jest friendId (może się zdarzyć w logice natychmiastowej)
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Już jest w znajomych' });
    }

    // Stwórz powiadomienie friendRequest u tamtej osoby (receiver = friendId)
    const Notification = require('../models/notification-model');
    const existingNotif = await Notification.findOne({
      receiver: friendId,
      sender: req.userId,
      type: 'friendRequest'
    });
    if (existingNotif) {
      return res.status(400).json({ message: 'Już wysłałeś zaproszenie wcześniej' });
    }

    const newNotif = new Notification({
      receiver: friendId,
      sender: req.userId,
      type: 'friendRequest',
      message: `${user.username} zaprasza Cię do znajomych`
    });
    await newNotif.save();

    return res.json({ message: 'Wysłano zaproszenie do znajomych (powiadomienie)' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});

router.post('/remove-friend', requireAuth, async (req, res) => {
  try {
    const { friendId } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    // Usuń friendId z tablicy friends
    const beforeCount = user.friends.length;
    user.friends = user.friends.filter(fid => fid.toString() !== friendId);
    if (user.friends.length === beforeCount) {
      // nic nie usunięto
      return res.status(400).json({ message: 'Ten użytkownik nie był w znajomych' });
    }

    await user.save();
    return res.json({ message: 'Usunięto ze znajomych' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});



router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('friends', 'username'); 
    if (!user) {
      return res.status(404).json({ message: 'Nie znaleziono użytkownika' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});

router.get('/search', requireAuth, async (req, res) => {
  try {
    const { name } = req.query;
    const users = await User.find({
      username: { $regex: name, $options: 'i' }
    }).select('username');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd wyszukiwania' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('friends', 'username');
    if (!user) {
      return res.status(404).json({ message: 'Nie znaleziono usera' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu usera' });
  }
});

router.get('/search', requireAuth, async (req, res) => {
  try {
    const { name } = req.query;
    const users = await User.find({
      username: { $regex: name, $options: 'i' } // case-insensitive wyszukiwanie
    }).select('username');

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd wyszukiwania' });
  }
});

module.exports = router;