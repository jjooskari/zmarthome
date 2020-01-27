const devicesRouter = require('express').Router()
const DeviceManager = require('../services/DeviceService.js')

const devices = new DeviceManager()

devicesRouter.get("/", (req, res, next) => {
    try {
        res.json(devices.list())
    } catch (e) { next(e) }
})

devicesRouter.post("/", async (req, res, next) => {
    try {
        const body = req.body
        const ip = body.ip
        const topic = body.topic
        const type = body.type
        res.json(await devices.addDevice(ip, topic, type))
    } catch (e) { next(e) }
})

devicesRouter.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        devices.removeDevice(id)
        res.status(200).end()
    } catch (e) { next(e) }
})

devicesRouter.get('/:id/status', async (req, res, next) => {
    const id = req.params.id
    try {
        const s = await devices.status(id)
        res.json({"status": s})
    } catch (e) { next(e) }
})

devicesRouter.put('/:id/power/:pow', (req, res, next) => {
    const id = req.params.id
    const pow = Number(req.params.pow)
    try {
        devices.connection(id).setPower(pow)
        res.status(200).end()
    } catch (e) { next(e) }
})

devicesRouter.get("/:id/toggle", (req, res, next) => {
    const id = req.params.id
    try {
        devices.toggle(id)
        res.status(200).end()
    } catch (e) { next(e) }
})

console.log("device router registered")

module.exports = devicesRouter