const mongoose = require('mongoose');

const UtilitySchema = new mongoose.Schema({
  date: { type: String, required: true },
  school: { type: String, required: true },
  type: { type: String, required: true },   // gas_cylinder, bulk_gas, water, electricity
  previousReading: Number,
  currentReading: Number,
  consumption: Number,
  remarks: String
}, { timestamps: true });

module.exports = mongoose.model('Utility', UtilitySchema);