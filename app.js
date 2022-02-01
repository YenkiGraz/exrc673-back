const express = require('express');
const cors = require('cors')
require('dotenv').config()
const containersRouter = require('./src/routes/containers');
const httpLogger = require('./src/logger/httpLogger')

function serverGenerator() {
    const app = express();

    app.use(cors()); // Init cors
    app.use(express.json()); // Init json
    app.use(httpLogger); // Init http logger
    app.use('/api/v1/containers', containersRouter); // Init routes

    // TODO - error handler

    return app
}

module.exports = serverGenerator