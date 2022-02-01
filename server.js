const serverGenerator = require("./app");
const logger = require("./src/logger/functionLogger");
const connectDb = require("./src/db/dbConnection");

const app = serverGenerator()
const PORT = process.env.PORt || 3000;

(async () => await connectDb())(); // Init db connection

app.listen(PORT, () => {
    logger.info(`app listen on port ${PORT}`);
})