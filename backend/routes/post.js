const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const requireAuth = require('../middleware/auths');
const Post = require('../models/post-model'); 
const User = require('../models/user-model');     


router.post(
  '/create',
  requireAuth,
  async (req, res) => {
    try {
      const { description, whatWasDrunk, cost, withFriends, image } = req.body;

      const newPost = new Post({
        author: req.userId,
        description,
        whatWasDrunk,
        cost,
        withFriends,  // tablica IDs znajomych
        image
      });

      await newPost.save();
      return res.status(201).json({ message: 'Post utworzony', post: newPost });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Błąd serwera przy tworzeniu posta' });
    }
  }
);


router.get('/', requireAuth, async (req, res) => {
  try {
    // np. sortujemy po dacie malejąco
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('author', 'username')     // jeżeli chcesz mieć dane usera
      .populate('withFriends', 'username')
      .populate('comments.user', 'username'); // wyświetli username autora komentarza

    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera przy pobieraniu postów' });
  }
});


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
        user: req.userId,
        text: text,
        createdAt: new Date()
      };
      post.comments.push(newComment);
      await post.save();

      return res.json({ message: 'Dodano komentarz', post });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Błąd serwera przy dodawaniu komentarza' });
    }
  }
);


router.delete('/:postId/comment/:commentId', requireAuth, async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post nie istnieje' });
    }

    // Szukanie komentarza
    const commentIndex = post.comments.findIndex(
      c => c._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Komentarz nie istnieje' });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    return res.json({ message: 'Komentarz usunięty', post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera przy usuwaniu komentarza' });
  }
});


router.post('/:postId/like', requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post nie istnieje' });
    }

    // Czy user już polubił
    const hasLiked = post.likedBy.includes(req.userId);

    if (hasLiked) {
      // Odlajkowanie
      post.likedBy = post.likedBy.filter(
        userId => userId.toString() !== req.userId
      );
      await post.save();
      return res.json({ message: 'Post odlubiony', post });
    } else {
      
      post.likedBy.push(req.userId);
      await post.save();
      return res.json({ message: 'Post polubiony', post });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera przy lajkowaniu posta' });
  }
});

module.exports = router;