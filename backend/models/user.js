const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // lista znajomych
  points: { type: Number, default: 0 }, // punkty doświadczenia
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);