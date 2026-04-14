require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Utility = require('./models/Utility');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Debug: Show if MONGO_URI is loading
console.log("MONGO_URI from .env =", process.env.MONGO_URI ? "✅ LOADED" : "❌ UNDEFINED");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing or undefined in .env file");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
  }
};

connectDB();

// Add new record
app.post('/add', async (req, res) => {
  try {
    const { date, school, type, previousReading, currentReading, remarks } = req.body;
    const consumption = (currentReading || 0) - (previousReading || 0);

    const record = new Utility({
      date,
      school,
      type,
      previousReading: previousReading || 0,
      currentReading,
      consumption: Math.max(0, consumption),
      remarks: remarks || ''
    });

    await record.save();
    res.json({ success: true, consumption: record.consumption, message: "Record saved!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all records
app.get('/data', async (req, res) => {
  try {
    const data = await Utility.find().sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});