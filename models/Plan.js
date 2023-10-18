const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: String,
  price: Number,
  period: String,
  status: {
    type: String,
    enum: ['A', 'D'],
  },
  features: {
    videos: Boolean,
    audio: Boolean,
    download: Boolean,
    streaming: Boolean,
    customize: Boolean,
  },
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
