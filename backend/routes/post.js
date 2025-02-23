const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const requireAuth = require('../middleware/auths');
const Post = require('../models/post-model');
const User = require('../models/user-model');  

/** Tworzenie posta */
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { description, whatWasDrunk, cost, withFriends, image } = req.body;
    const newPost = new Post({
      author: req.userId,
      description,
      whatWasDrunk,
      cost,
      withFriends,
      image
    });
    await newPost.save();
    return res.status(201).json({ message: 'Post utworzony', post: newPost });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera przy tworzeniu posta' });
  }
});

/** Pobieranie postów (z opcją userId=xxx) */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { userId } = req.query; 
    let filter = {};
    if (userId) {
      filter.author = userId;
    }
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .populate('withFriends', 'username')
      .populate('comments.user', 'username');
    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Błąd serwera przy pobieraniu postów' });
  }
});

/** Dodawanie komentarza */
router.post('/:postId/comment',
  requireAuth,
  [
    check('text').notEmpty().withMessage('Komentarz nie może być pusty')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { postId } = req.params;
      const { text } = req.body;
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post nie istnieje' });

      post.comments.push({
        user: req.userId,
        text,
        createdAt: new Date()
      });
      await post.save();
      return res.json({ message: 'Dodano komentarz', post });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Błąd serwera przy dodawaniu komentarza' });
    }
  }
);

/** Usuwanie komentarza */
router.delete('/:postId/comment/:commentId', requireAuth, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post nie istnieje' });
    }
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

/** Lajkowanie / odlajkowanie posta */
router.post('/:postId/like', requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post nie istnieje' });
    }
    const hasLiked = post.likedBy.includes(req.userId);
    if (hasLiked) {
      // Odlajkowanie
      post.likedBy = post.likedBy.filter(u => u.toString() !== req.userId);
      await post.save();
      return res.json({ message: 'Post odlubiony', post });
    } else {
      // Polubienie
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