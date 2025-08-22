const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  partySize: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
