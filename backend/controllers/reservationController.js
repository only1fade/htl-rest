const Reservation = require('../models/reservation');

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { name, email, phone, date, time, partySize } = req.body;
    const reservation = new Reservation({
      user: req.user.userId,
      name,
      email,
      phone,
      date,
      time,
      partySize
    });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reservations for the current user
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.userId });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// (Optional) Get all reservations (admin)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('user', 'name email');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel a reservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
