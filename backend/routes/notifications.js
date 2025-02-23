const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auths');
const Notification = require('../models/notification-model');

// GET /api/notifications -> listuje powiadomienia zalogowanego usera
router.get('/', requireAuth, async (req, res) => {
    try {
      const notifications = await Notification.find({ receiver: req.userId })
        .sort({ createdAt: -1 })
        .populate('sender', 'username');
      
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ message: 'Błąd pobierania powiadomień' });
    }
  });
  
  router.post('/:id/accept', requireAuth, async (req, res) => {
    try {
      const notif = await Notification.findById(req.params.id);
      if (!notif) return res.status(404).json({ message: 'Brak takiego powiadomienia' });
  
      // Sprawdzamy, czy to jest friendRequest
      if (notif.type !== 'friendRequest') {
        return res.status(400).json({ message: 'To powiadomienie nie jest zaproszeniem do znajomych' });
      }
      // Czy ja (req.userId) jestem receiverem?
      if (notif.receiver.toString() !== req.userId) {
        return res.status(403).json({ message: 'Nie jesteś odbiorcą tego zaproszenia' });
      }
  
      // Gdy akceptuję: dopiszemy do friends w OBIE strony
      const User = require('../models/user-model');
      const me = await User.findById(req.userId);
      const friendUser = await User.findById(notif.sender);
  
      if (!me || !friendUser) {
        return res.status(404).json({ message: 'Nie znaleziono któregoś użytkownika' });
      }
  
      // Sprawdzamy, czy już nie jesteśmy znajomymi
      if (!me.friends.includes(friendUser._id)) {
        me.friends.push(friendUser._id);
        await me.save();
      }
      if (!friendUser.friends.includes(me._id)) {
        friendUser.friends.push(me._id);
        await friendUser.save();
      }
  
      // Oznaczamy powiadomienie jako isRead = true, ewentualnie usuwamy
      notif.isRead = true;
      await notif.save();
  
      return res.json({ message: 'Zaproszenie zaakceptowane, jesteście znajomymi' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Błąd akceptowania powiadomienia' });
    }
  });
  
  router.post('/:id/reject', requireAuth, async (req, res) => {
    try {
      const notif = await Notification.findById(req.params.id);
      if (!notif) {
        return res.status(404).json({ message: 'Brak takiego powiadomienia' });
      }
      if (notif.type !== 'friendRequest') {
        return res.status(400).json({ message: 'To powiadomienie nie jest zaproszeniem do znajomych' });
      }
      // Tylko odbiorca może odrzucić
      if (notif.receiver.toString() !== req.userId) {
        return res.status(403).json({ message: 'Nie jesteś odbiorcą tego zaproszenia' });
      }
  
      // Usuwamy / oznaczamy powiadomienie
      await notif.remove(); // lub notif.isRead = true; await notif.save();
      return res.json({ message: 'Zaproszenie odrzucone' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Błąd odrzucania zaproszenia' });
    }
  });

  module.exports = router