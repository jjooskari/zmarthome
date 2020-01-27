const mongoose = require('mongoose')
const conf = require("../config")

const deviceSchema = new mongoose.Schema({
    ip: {type: String, required: true, unique: true},
    topic: {type: String, required: true, unique: true},
    type: String
})

deviceSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Device", deviceSchema)