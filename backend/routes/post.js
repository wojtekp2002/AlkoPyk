const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const requireAuth = require('../middleware/auths');
const Post = require('../models/post-model');

// ====================
// 1) Tworzenie posta z walidacją cost
// ====================
router.post(
  '/create', 
  requireAuth,
  // Tutaj używamy express-validator:
  [
    check('cost')
      .optional() // cost może być opcjonalny, ale jeśli jest, to musi być liczbą
      .isNumeric()
      .withMessage('Cost musi być liczbą'),
    check('description')
      .optional()
      .isString()
      .withMessage('description musi być tekstem')
  ],
  async (req, res) => {
    try {
      // Sprawdzamy błędy walidacji:
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { description, whatWasDrunk, cost, withFriends, image } = req.body;

      const newPost = new Post({
        author: req.userId,
        description,
        whatWasDrunk,
        cost,
        withFriends,
        image // base64 (np. "data:image/png;base64,....")
      });

      await newPost.save();
      return res.status(201).json({ message: 'Post utworzony', post: newPost });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
  }
);

// ====================
// 2) Pobieranie listy postów (feed)
// ====================
router.get('/', requireAuth, async (req, res) => {
  try {
    // Przykład: pobieramy wszystkie posty, posortowane od najnowszych
    // (Możesz tu dodać logikę, by pobierać tylko posty znajomych itp.)
    const posts = await Post.find({})
      .populate('author', 'username')       // dołącz dane autora (np. username)
      .populate('withFriends', 'username')  // dołącz dane znajomych
      .sort({ createdAt: -1 });            // sortowanie malejąco po dacie

    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});

// ====================
// 3) Dodawanie komentarza
// ====================
router.post(
  '/:postId/comment',
  requireAuth,
  [
    check('text')
      .notEmpty()
      .withMessage('Komentarz nie może być pusty')
  ],
  async (req, res) => {
    try {
      // Walidacja
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { postId } = req.params;
      const { text } = req.body;

      // Znajdź posta
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post nie istnieje' });
      }

      // Dodajemy komentarz do tablicy comments
      const newComment = {
        user: req.userId,   // kto dodał komentarz
        text: text,
        createdAt: new Date()
      };
      post.comments.push(newComment);
      await post.save();

      return res.json({ message: 'Dodano komentarz', post });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
  }
);

// ====================
// 4) Lajkowanie posta
// ====================
router.post('/:postId/like', requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post nie istnieje' });
    }

    // Prosty przykład: zwiększamy pole likesCount o 1
    post.likesCount += 1;
    await post.save();

    return res.json({ message: 'Dodano lajka', post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;