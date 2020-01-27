const mqtt = require('mqtt')
const conf = require("../config")

const hostUrl = conf.mqtt_host
const timeout = conf.mqtt_timeout

class DeviceConnection {
    constructor (name, credentials) {
        this.name = name
        this.power = 0
        this.pending = true

        this.powerSub = mqtt.connect(hostUrl, credentials)
        this.powerSub.subscribe("stat/" + name + "/POWER")
        this.powerSub.on("message", (topic, message) => {
            if (message == "ON") { this.power = 1; this.pending = false }
            else if (message == "OFF") { this.power = 0; this.pending = false }
            else {
                console.log("Unknown message on stat/" + name + "/POWER : " + message)
            }
            console.log("Setting " + name + ", power:", this.power.toString())})

        this.statSub = mqtt.connect(hostUrl, credentials)
        this.statSub.subscribe("stat/" + name + "/STATUS")
        this.statSub.on("message", (topic, message) => {
            try {
                let mJson = JSON.parse(message);
                let pow = mJson["Status"]["Power"]
                this.power = pow
                this.pending = false
                console.log("Device " + name + ", status:", this.power.toString())
            } catch (e) {
                console.log("Error on connection stat/" + name + "/STATUS:", e)
            }
        })

        this.pub = mqtt.connect(hostUrl, credentials)
        this.pub.publish("cmnd/" + name + "/STATUS", "")
    }

    async status() {
        await this.statusReady()
        return this.power
    }

    async setPower(p) {
        if ( !(p == 0 || p == 1) ) {
            console.log("Powering device " + this.name + " failed, invalid argument: " + p)
            return
        }
        this.pending = true
        this.pub.publish("cmnd/" + this.name + "/power", p.toString())
        const new_s = await this.status()
        if (new_s != p) {
            console.log("Powering device " + this.name + " failed")
            console.log(news, p)
        }
    }

    async toggle() {
        let p = await this.status()
        this.setPower(1 - p)
    }

    async statusReady() {
        var start_time = new Date().getTime()

        while (true) {
          if (!this.pending) {
            return true
          }
          if (new Date() > start_time + timeout) {
            console.log("Status on device " + this.name + " timed out");
            return false
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

module.exports = DeviceConnection