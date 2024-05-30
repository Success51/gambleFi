// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gambling_db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Currency Schema
const currencySchema = new mongoose.Schema({
    currencyAmount: Number
});

const Currency = mongoose.model('Currency', currencySchema);

// API Endpoint to Save Currency
app.post('/api/saveCurrency', async (req, res) => {
    const { currencyAmount } = req.body;

    try {
        const currency = new Currency({ currencyAmount });
        await currency.save();
        res.status(200).json({ message: 'Currency saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while saving currency' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
