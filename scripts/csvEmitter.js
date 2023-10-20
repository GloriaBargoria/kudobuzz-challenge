const { EventEmitter } = require('events')
const fs = require('fs')
const json2csv = require('json2csv')

const csvEmitter = new EventEmitter()

csvEmitter.on('filterAndExportSubscriptions', (subscriptions) => {
  try {
    const filteredSubscriptions = subscriptions.filter((subscription) => {
      // Add your filter logic here, comparing plan price with $50
      return subscription.plan_id.price >= 50
    })

    const csvFields = ['business_id', 'email', 'plan_id', 'plan_name', 'plan_price', 'payment_platform_name']
    const csvData = json2csv.parse(filteredSubscriptions, { fields: csvFields })

    const filePath = 'output/subscriptions.csv'

    fs.writeFileSync(filePath, csvData)
    console.log('Filtered subscriptions exported to CSV:', filePath)
  } catch (error) {
    console.error('Error filtering and exporting subscriptions:', error)
  }
})

module.exports = csvEmitter
