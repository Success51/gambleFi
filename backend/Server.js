// Backend: server.js

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gambleFi', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define database schema
const userSchema = new mongoose.Schema({
  walletAddress: String,
  coins: Number
});

const User = mongoose.model('User', userSchema);

// API endpoint to save coins for a user's wallet
app.post('/api/save-coins', async (req, res) => {
  const { walletAddress, coins } = req.body;

  try {
    // Find user by wallet address or create new user if not found
    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = new User({ walletAddress, coins: 0 });
    }

    // Update coins for the user
    user.coins += coins;
    await user.save();

    res.status(200).json({ message: 'Coins saved successfully' });
  } catch (error) {
    console.error('Error saving coins:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint to retrieve coins for a user's wallet
app.get('/api/get-coins/:walletAddress', async (req, res) => {
  const { walletAddress } = req.params;

  try {
    // Find user by wallet address
    const user = await User.findOne({ walletAddress });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ coins: user.coins });
  } catch (error) {
    console.error('Error retrieving coins:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
