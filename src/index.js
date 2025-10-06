require("dotenv").config();
require("./services/instrument");
const Sentry = require("@sentry/node");
const connectToMongoDB = require("./services/mongo.client");
const createApp = require("./app/app");
const port = process.env.PORT;
const {connectToRedis} = require("./services/redis.client");

(async () => {
  try {
    await connectToMongoDB();
  } catch (error) {
    console.log("Error al conectar a MongoDB: ", error);
    process.exit(1);
  }
})();


(async () => {
  try {
    await connectToRedis();
  } catch (error) {
    console.log("Error al conectar a Redis: ", error);
    process.exit(1);
  }
})();

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
