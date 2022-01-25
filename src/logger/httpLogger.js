const morgan = require("morgan");
const mongooseMorgan = require('mongoose-morgan');

const isProduction = () => {
    return process.env.NODE_ENV !== 'development'
}

const buildDevLogger = () => {
    return morgan('dev', {
        skip: function (req, res) {
            return res.statusCode < 400
        }
    })
}

const buildProdLogger = () => {
    return mongooseMorgan({
            collection: 'http_logger',
            connectionString: process.env.MONGO_URI
        },
        {},
        'combined'
    )
}

const httpLogger = isProduction() ? buildProdLogger() : buildDevLogger()

module.exports = httpLogger