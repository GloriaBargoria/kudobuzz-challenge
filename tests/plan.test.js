const chai = require('chai')
const expect = chai.expect
const Plan = require('../models/plan')

describe('Plan Model Validation', () => {
  it('should be valid if all required fields are provided', (done) => {
    const plan = new Plan({
      name: 'Platinum',
      price: 100,
      period: 'monthly',
      status: 'A',
    })
    plan.validate((err) => {
      expect(err).to.be.null
      done()
    })
  })

  it('should be invalid if required fields are missing', (done) => {
    const plan = new Plan()
    plan.validate((err) => {
      expect(err).not.to.be.null
      done()
    })
  })
})
