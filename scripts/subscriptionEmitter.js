const { EventEmitter } = require("events")
const Subscription = require("../models/subscription")
const { v4: uuidv4 } = require("uuid")
const Plan = require("../models/plan")

const subscriptionEmitter = new EventEmitter()

function generateUniqueBusinessId() {
  return uuidv4()
}

function generateUniqueEmail() {
  var char = "abcdefghijklmnopqrstuvwxyz0123456789"
  var emailStr = ""
  for (i = 0; i < 12; i++) {
    emailStr += char[Math.floor(Math.random() * char.length)]
  }

  return `${emailStr}@mail.com`
}

function generateRandomString(length) {
  let result = ""
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

function generateRandomPaymentPlatformName() {
  const paymentPlatforms = ["Stripe", "Paypal"]
  const randomIndex = Math.floor(Math.random() * paymentPlatforms.length)
  return paymentPlatforms[randomIndex]
}

function generateRandomPaymentPlatformExternalID() {
  return uuidv4()
}

function retrievePlansFromDatabase() {
  return Plan.find()
    .exec()
    .then((plans) => {
      return plans
    })
    .catch((error) => {
      throw error
    })
}

const planLookup = {}

retrievePlansFromDatabase()
  .then((plansData) => {

    plansData.forEach((plan) => {
      planLookup[plan.name] = plan._id
    })
    // console.log(plansData)
  })
  .catch((error) => {
    console.error("Error retrieving plans:", error)
  })

function generateUniqueSubscriptions(plansData) {
  const subscriptions = []

  const planNumbers = {
    freemium: 500,
    bronze: 7000,
    silver: 12000,
    gold: 8000,
    platinum: 5000,
  }

  console.log("plans first", plansData)

  for (const plan of plansData) {
    const { name: planName } = plan
    const planId = plansData._id
    console.log(plansData, "plan id")
    // console.log(
    //   `Generating subscription for plan: ${planName}, planId: ${planId}`
    // )

    const numberOfSubscriptions = planNumbers[planName.toLowerCase()]

    for (let i = 0; i < numberOfSubscriptions; i++) {
      const subscription = {
        business_id: generateUniqueBusinessId(),
        email: generateUniqueEmail(),
        plan_id: planId,
        payment_platform: {
          token: generateRandomString(40),
          external_id: generateRandomPaymentPlatformExternalID(),
          name: generateRandomPaymentPlatformName(),
        },
      }

      subscriptions.push(subscription)
    }
  }

  return subscriptions
}

subscriptionEmitter.on("generateSubscriptions", () => {
  try {
    Plan.find()
      .exec()
      .then((plansData) => {
        if (!plansData || plansData.length === 0) {
          throw new Error("No plans found in the database")
        }

        const subscriptions = generateUniqueSubscriptions(plansData)
        // console.log("subs", subscriptions)

        return Subscription.insertMany(subscriptions)
      })
      .then((insertedSubscriptions) => {
        console.log("Subscriptions added to the database")

        subscriptionEmitter.emit(
          "filterAndExportSubscriptions",
          insertedSubscriptions
        )
      })
      .catch((error) => {
        console.error("Error generating subscriptions first one:", error)
        subscriptionEmitter.emit("subscriptionGenerationError", error)
      })
  } catch (error) {
    console.error("Error generating subscriptions:", error)
    subscriptionEmitter.emit("subscriptionGenerationError", error)
  }
})

module.exports = { subscriptionEmitter, generateUniqueSubscriptions }
