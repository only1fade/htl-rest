const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/reservations', require('./routes/reservation'));
app.use('/api/orders', require('./routes/order'));

// Connect to MongoDB using mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Restaurant backend is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
