const mongoose = require('mongoose')

const payment_platform = ['Stripe', 'Paypal']

const subscriptionSchema = new mongoose.Schema({
  business_id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  plan_id: {
    type: String,
    required: true,
  },
  payment_platform: {
    token: {
      type: String,
      required: true,
    },
    external_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      enum: payment_platform,
      required: true,
    },
  },
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

module.exports = Subscription
