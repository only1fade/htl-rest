const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // e.g., pending, preparing, completed, cancelled
  address: String, // for delivery
  phone: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
