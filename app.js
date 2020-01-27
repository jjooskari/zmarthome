console.log("Starting zmarthome")

// Import and declare
const conf = require("./config")
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const devicesRouter = require('./controllers/devices')
const middleware = require("./middleware")
const mongoose = require('mongoose')

// Connect to database
console.log("connecting to", conf.db_uri)
mongoose.connect(conf.db_uri,
  {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((e) => {
    console.log('connecting to MongoDB failed:', e)
  })

// Testing db connection
const Device = require("./models/device.js")
const printEntries = () => {
  Device.find({}).then(result => {
    result.forEach(device => {
      console.log(device.toJSON())
    })
  })
}
printEntries()

// Use middleware and routes
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)

console.log("Using apipath:", conf.api_path)
app.use(conf.api_path + "/devices", devicesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
