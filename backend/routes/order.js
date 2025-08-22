const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordercontroller');
const auth = require('../middleware/auth');

// Create a new order
router.post('/', auth, orderController.createOrder);

// Get all orders for the current user
router.get('/my', auth, orderController.getUserOrders);

// (Optional) Get all orders (admin)
router.get('/all', auth, orderController.getAllOrders);

// Update order status (admin)
router.put('/:id/status', auth, orderController.updateOrderStatus);

// Delete an order
router.delete('/:id', auth, orderController.deleteOrder);

module.exports = router;
