const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String },
  withFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  whatWasDrunk: { type: String },
  cost: { type: Number, default: 0 },
  image: { type: String },

  // Lajki – zamiast liczyć samą liczbę, przechowajmy listę userów, którzy polubili
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Komentarze – tablica obiektów
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],

}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);