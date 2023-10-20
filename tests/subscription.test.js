const chai = require('chai')
const expect = chai.expect
const Subscription = require('../models/subscription')

describe('Subscription Model Validation', () => {
  it('should be valid if all required fields are provided', (done) => {
    const subscription = new Subscription({
      business_id: 'unique_id',
      email: 'test@example.com',
      plan_id: 'plan_id',
    })
    subscription.validate((err) => {
      expect(err).to.be.null
      done()
    })
  })

  it('should be invalid if required fields are missing', (done) => {
    const subscription = new Subscription()
    subscription.validate((err) => {
      expect(err).not.to.be.null
      done()
    })
  })
})
