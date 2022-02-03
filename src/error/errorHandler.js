const ApiError = require("./ApiError");
const logger = require("../logger/functionLogger");

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        logger.error({code: err.code, message: err.message})
        res.status(err.code).send(err.message)
    }

    logger.error({code: 500, message: 'something went wrong'})
    res.status(500).send('something went wrong');
}

module.exports = errorHandler