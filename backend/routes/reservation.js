const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');

// Create a new reservation
router.post('/', auth, reservationController.createReservation);

// Get all reservations for the current user
router.get('/my', auth, reservationController.getUserReservations);

// (Optional) Get all reservations (admin)
router.get('/all', auth, reservationController.getAllReservations);

// Cancel a reservation
router.delete('/:id', auth, reservationController.deleteReservation);

module.exports = router;
