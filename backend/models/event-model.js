const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  // Tablica obiektów "drinks", w których zapisujesz, kto wypił, co wypił, ile ml i koszt
  drinks: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String,      // nazwa trunku (np. "Piwo", "Wódka", "Whisky")
      volume: Number,    // ml, np. 100
      cost: Number,      // koszt, np. 10.50
      time: { type: Date, default: Date.now }
    }
  ],
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  isActive: { type: Boolean, default: true }, // czy impreza trwa?
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
