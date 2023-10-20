const mongoose = require("mongoose")

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  period: {
    type: String,
    required: true,
    enum: ["monthly", "quarterly", "annually"],
  },
  status: {
    type: String,
    enum: ["A", "D"],
    required: true,
  },
  features: {
    videos: Boolean,
    audio: Boolean,
    download: Boolean,
    streaming: Boolean,
    customize: Boolean,
  },
})

const Plan = mongoose.model("Plan", planSchema)

module.exports = Plan
