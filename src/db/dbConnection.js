const mongoose = require('mongoose');
const logger = require("../logger/functionLogger");

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        logger.info(`MongoDb connected to: '${conn.connections[0].host}:${conn.connections[0].port}'`)
    } catch (err) {
        logger.error(new Error(`MongoDb falied to connect : ${err}`))
        process.exit(1);
    }
}

module.exports = connectDb;