const dotenv = require('dotenv');

const conf = dotenv.config()

if (!conf) {
    throw new Error(".env file not found")
}

module.exports = {
    port: process.env.SERVER_PORT,
    api_path: process.env.API_PATH,
    db_uri: process.env.MONGODB_HOST + ":"
        + process.env.MONGODB_PORT + "/"
        + process.env.MONGODB_NAME,
    mqtt_credentials: {
        "username": process.env.MQTT_USER,
        "password": process.env.MQTT_PASSWORD
    },
    mqtt_host: process.env.MQTT_HOST_URL,
    mqtt_timeout: process.env.MQTT_TIMEOUT
}