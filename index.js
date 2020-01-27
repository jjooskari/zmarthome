const app = require("./app")
const http = require("http")
const conf = require("./config")

app.listen(conf.port, () => {
    console.log(`Server running on port ${conf.port}`)
})