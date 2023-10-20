const express = require("express")
const mongoose = require("mongoose")
const Plan = require("./models/plan")
const {
  generateUniqueSubscriptions,
} = require("./scripts/subscriptionEmitter")
const { createObjectCsvWriter } = require("csv-writer")
const fs = require("fs")
const Subscription = require("./models/subscription")

const app = express()
const port = process.env.PORT || 3000

mongoose.connect(
  "mongodb+srv://glow:Ballerkid254@cluster0.11p1tki.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

const db = mongoose.connection
db.on("error", (error) => {
  console.error("MongoDB connection error:", error)
  process.exit(1)
})

db.once("open", () => {
  console.log("Connected to MongoDB")

  const plansData = require("./data/plansData")
  Plan.insertMany(plansData)
    .then(() => {
      console.log("Plans added to the database")

      const subscriptions = generateUniqueSubscriptions(plansData)
      console.log("Subscriptions generated")

      Subscription.insertMany(subscriptions)
        .then(() => {
          console.log("Subscriptions added to the database")

        })
        .catch((error) => {
          console.error("Error inserting subscriptions into the database:", error)
        })

      const csvWriter = createObjectCsvWriter({
        path: "subscriptions.csv",
        header: [
          { id: "business_id", title: "business_id" },
          { id: "email", title: "email" },
          { id: "plan_id", title: "plan_id" },
          { id: "plan_name", title: "plan_name" },
          { id: "plan_price", title: "plan_price" },
          { id: "payment_platform_name", title: "payment_platform_name" },
        ],
      })

      csvWriter.writeRecords(subscriptions, { encoding: 'utf8' }).then(() => {
        console.log("CSV file has been written")
      })

      app.get("/", (req, res) => {
        const csvFilePath = "subscriptions.csv"
      
        if (fs.existsSync(csvFilePath)) {
          res.setHeader("Content-Type", "text/csv; charset=utf-8")
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=subscriptions.csv"
          )
      
          const fileStream = fs.createReadStream(csvFilePath)
          fileStream.pipe(res)
        } else {
          res.status(404).send("CSV file not found")
        }
      })

    })
    .catch((error) => {
      console.error("Error:", error)
    })
})

app.get("/", (req, res) => {
  const csvFilePath = "subscriptions.csv"

  console.log("response", res)

  if (fs.existsSync(csvFilePath)) {
    res.setHeader("Content-Type", "text/csv; charset=utf-8")
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=subscriptions.csv"
    )

    const fileStream = fs.createReadStream(csvFilePath)

    fileStream.pipe(res)
  } else {
    res.status(404).send("CSV file not found")
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
