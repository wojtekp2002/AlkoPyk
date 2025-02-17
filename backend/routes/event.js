const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auths');
const Event = require('../models/event-model');  
const User = require('../models/user-model');          
const Post = require('../models/post-model');    

// 1) Tworzenie "imprezy"
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { title } = req.body;

    const newEvent = new Event({
      title,
      host: req.userId,           
      participants: [req.userId], 
    });

    await newEvent.save();
    return res.status(201).json({ 
      message: 'Impreza utworzona', 
      event: newEvent 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});

// 2) Dołączanie do imprezy
router.post('/join', requireAuth, async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event nie istnieje' });
    }

    // Czy użytkownik już jest w participants?
    if (event.participants.includes(req.userId)) {
      return res.status(400).json({ message: 'Już dołączyłeś do tej imprezy' });
    }

    event.participants.push(req.userId);
    await event.save();

    return res.json({ 
      message: 'Dołączono do imprezy', 
      event 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});

// 3) Dodawanie drinków
router.post('/addDrink', requireAuth, async (req, res) => {
  try {
    const { eventId, name, volume, cost } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event nie istnieje' });
    }

    // Sprawdzenie, czy user jest w participants
    if (!event.participants.includes(req.userId)) {
      return res.status(403).json({ message: 'Nie jesteś uczestnikiem tej imprezy' });
    }

    // Dodajemy nowy obiekt "drink"
    const newDrink = {
      user: req.userId,
      name,
      volume,
      cost
      // time jest domyślnie ustawiany w schemacie
    };
    event.drinks.push(newDrink);
    await event.save();

    return res.json({ 
      message: 'Dodano drink', 
      event 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});

// 4) Zakończenie imprezy
router.post('/end', requireAuth, async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event nie istnieje' });
    }

    // Tylko gospodarz może zakończyć imprezę
    if (event.host.toString() !== req.userId) {
      return res.status(403).json({ message: 'Tylko gospodarz może zakończyć imprezę' });
    }

    // Zmieniamy status eventu
    event.isActive = false;
    event.endTime = Date.now();
    await event.save();

    // Naliczamy punkty
    const drinksByUser = {};
    event.drinks.forEach(d => {
      const userId = d.user.toString();
      if (!drinksByUser[userId]) {
        drinksByUser[userId] = 0;
      }
      drinksByUser[userId] += d.volume; // sumujemy ml
    });

    for (const userId of event.participants) {
      const totalVolume = drinksByUser[userId] || 0;
      const pointsToAdd = Math.floor(totalVolume / 100); // 1 punkt = 100 ml
      if (pointsToAdd > 0) {
        const userDoc = await User.findById(userId);
        if (userDoc) {
          userDoc.points += pointsToAdd;
          await userDoc.save();
        }
      }
    }

    // Tworzenie posta podsumowującego
    const totalCost = event.drinks.reduce((acc, d) => acc + (d.cost || 0), 0);
    const uniqueDrinks = [...new Set(event.drinks.map(d => d.name))].join(', ');

    const newPost = new Post({
      author: event.host,
      description: `Impreza: ${event.title}`,
      whatWasDrunk: uniqueDrinks,
      cost: totalCost,
      withFriends: event.participants
      // image
    });
    await newPost.save();

    return res.json({ 
      message: 'Impreza zakończona. Post utworzony!', 
      event,
      post: newPost
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;