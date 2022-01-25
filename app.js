const express = require('express');
const cors = require('cors')
require('dotenv').config()
const connectDb = require('./src/db/dbConnection')
const containersRouter = require('./src/routes/containers');
const logger = require("./src/logger/functionLogger");
const httpLogger = require('./src/logger/httpLogger')

//  TODO - logger
const app = express();
const PORT = process.env.PORt || 3000

// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

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
