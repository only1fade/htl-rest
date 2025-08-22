const MenuItem = require('../models/menuItem');

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single menu item by ID
exports.getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    const newItem = new MenuItem({ name, description, price, image, category });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, category },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
