const {transports, createLogger, format} = require("winston");
const {timestamp, combine, printf, errors, colorize, json} = format
require('winston-mongodb');

const isProduction = () => {
    return process.env.NODE_ENV !== 'development'
}

const initLoggerLevel = () => {
    return isProduction() ? 'info' : 'debug'
}

const logFormat = printf(({level, message, timestamp, stack}) => {
    return `${timestamp} ${level}: ${stack || message}`
})

const buildDevLogger = () => {
    return createLogger({
        level: initLoggerLevel(),
        format: combine(
            timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            colorize(),
            errors({stack: true}),
            logFormat
        ),
        transports: [
            new transports.Console()
        ],
    });
}

const buildProdLogger = () => {
    return createLogger({
        level: initLoggerLevel(),
        format: combine(
            timestamp(),
            errors({stack: true}),
            json()
        ),
        defaultMeta: {service: 'user-service'},
        transports: [
            new transports.MongoDB({
                db: process.env.MONGO_URI,
                collection: 'function_logs',
                options: {useUnifiedTopology: true}
            })
        ],
    });
}

const functionLogger = isProduction() ? buildProdLogger() : buildDevLogger()

module.exports = functionLogger