const Order = require('../models/order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, total, address, phone, notes } = req.body;
    const order = new Order({
      user: req.user.userId,
      items,
      total,
      address,
      phone,
      notes
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders for the current user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// (Optional) Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an order (admin or user)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
