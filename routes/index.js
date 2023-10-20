const express = require("express")
const fs = require("fs")

const router = express.Router()

router.get("/", (req, res) => {
  const csvFilePath = "subscriptions.csv"

  if (fs.existsSync(csvFilePath)) {
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=subscriptions.csv")

    const fileStream = fs.createReadStream(csvFilePath)

    fileStream.pipe(res)
  } else {
    res.status(404).send("CSV file not found")
  }
})

module.exports = router
