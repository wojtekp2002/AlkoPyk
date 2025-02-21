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
  
  // POST /api/notifications/:id/accept (np. akceptujesz zaproszenie do znaj.)
  router.post('/:id/accept', requireAuth, async (req, res) => {
    try {
      const notif = await Notification.findById(req.params.id);
      if (!notif) return res.status(404).json({ message: 'Nie ma takiego powiadomienia' });
  
      // Tu logika: jeśli to friendRequest -> dodajesz do friends w User
      if (notif.type === 'friendRequest') {
        // np. user doc:
        // Akceptujesz, dodajesz do friends, usuwasz powiadomienie (lub isRead = true)
      }
      // Podobnie z eventInvite
  
      notif.isRead = true;
      await notif.save();
  
      res.json({ message: 'Powiadomienie zaakceptowane' });
    } catch (err) {
      res.status(500).json({ message: 'Błąd akceptowania powiadomienia' });
    }
  });
  
  module.exports = router