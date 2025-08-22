const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: String,
}, { timestamps: true });

module.exports = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
