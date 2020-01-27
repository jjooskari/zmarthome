const conf = require("../config")
const DeviceConnection = require("./MqttService")
const Device = require("../models/device.js")

const credentials = conf.mqtt_credentials
const hostUrl = conf.mqtt_host

class DeviceManager {
    constructor () {
        this.connections = {}
        this.loadConnections()
    }

    loadConnections() {
        console.log("Updating connections")
        this.connections = {}
        Device.find({}).then(result => {
            result.forEach(device => {
                console.log("Object:", device.toObject())
                this.connect(device.toObject())
            })
        })
    }

    connect(device) {
        const id = device._id.toString()
        const topic = device.topic
        this.connections[id] = new DeviceConnection(topic, credentials)
        console.log("Added a new connection with id:", id, "and topic:", topic)
    }

    async addDevice(ip, topic, type) {
        if (type != "switch") {
            throw new Error("invalid device type:", type) //only "switch" currently supported
        }
        Device.find({ip: ip}).then(result => {
            result.forEach(device => {
                this.removeDevice(device._id)
            })
        })
        Device.find({topic: topic}).then(result => {
            result.forEach(device => {
                this.removeDevice(device._id)
            })
        })
        let id = ""
        const newDevice = await new Device({
            topic: topic,
            ip: ip,
            type: type
        }).save().then(device => {
            this.connect(device.toObject())
            id = device._id.toString()
        })
        const json = {}
        json[id] = this.connection(id).name
        return json
    }

    removeDevice(id) {
        console.log("Removing device with id:", id)
        Device.findByIdAndDelete(id).then((result) => {
            console.log("Deleted", result)
        })
        delete this.connections[id]
    }

    connection(id) {
        if (id in this.connections) {
            return this.connections[id]
        } else {
            throw new ReferenceError("No such id in connections: " + id)
        }
    }

    device(id) {
        if (id in this.connections) {
            return {id: this.connections[id].name}
        } else {
            throw new ReferenceError("No such id in connections: " + id)
        }
    }

    list() {
        const result = {}
        Object.keys(this.connections).forEach((id) => {
            result[id] = this.connections[id].name
        })
        return result
    }

    powerOn(id) {
        this.connection(id).setPower(1)
    }

    powerOff(id) {
        this.connection(id).setPower(0)
    }

    toggle(id) {
        this.connection(id).toggle()
    }

    async status(id) {
        return await this.connection(id).status()
    }
}

module.exports = DeviceManager