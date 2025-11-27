require("dotenv").config();
require("./services/instrument");
const Sentry = require("@sentry/node");
const connectToMongoDB = require("./services/mongo.client");
const createApp = require("./app/app");
const port = process.env.PORT;
const { connectToRedis } = require("./services/redis.client");

const startServer = async () => {
  try {
    // Wait for both connections before starting the server
    await Promise.all([
      connectToMongoDB(),
      connectToRedis()
    ]);

    const app = createApp();

    // Register Sentry error handler after all controllers/routes and before any other error middleware
    Sentry.setupExpressErrorHandler(app);

    // Optional fallthrough error handler
    app.use(function onError(err, req, res, next) {
      res.statusCode = 500;
      res.end((res.sentry || "") + "\n");
    });

    app.listen(port, () => {
      console.log("Escuchando en el puerto: " + `http://localhost:${port}/swagger/`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
