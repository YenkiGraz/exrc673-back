const express = require('express');
const cors = require('cors')
require('dotenv').config()
const connectDb = require('./src/db/dbConnection')
const containersRouter = require('./src/routes/containers');
const logger = require("./src/logger/functionLogger");
const httpLogger = require('./src/logger/httpLogger')

const app = express();
const PORT = process.env.PORT || 3000

async function appGenerator(app) {
    app.use(cors()); // Init cors
    app.use(express.json()); // Init json
    app.use(httpLogger); // Init http logger
    app.use('/api/v1/containers', containersRouter); // Init routes
    await connectDb(); // Init db connection

    // TODO - error handler
}

appGenerator(app)

app.listen(PORT, () => {
    logger.info(`app listen on port ${PORT}`);
})
