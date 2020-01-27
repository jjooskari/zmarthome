const requestLogger = (req, res, next) => {
    console.log('---')
    console.log('REQUEST:')
    console.log('  Method:', req.method)
    console.log('  Path:  ', req.path)
    console.log('  Body:  ', req.body)
    console.log('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Endpoint unknown' })
}

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'ReferenceError') {
      return res.status(400).send({ error: 'invalid device id' })
    }
    if (error.name === 'MongoError') {
        return res.status(400)
        .send({ error: 'invalid json data, conflicting records exist' })
    }

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}