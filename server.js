const serverGenerator = require("./app");
const logger = require("./src/logger/functionLogger");

const app = serverGenerator()
const PORT = process.env.PORt || 3000

app.listen(PORT, () => {
    logger.info(`app listen on port ${PORT}`);
})