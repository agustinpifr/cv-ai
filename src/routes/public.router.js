const express = require("express");
const { getPing, getSwagger } = require("../controllers/public.controller");
const swaggerUI = require("swagger-ui-express");
const swaggerDoc = require ("../../swagger.json");

const publicRouter = express.Router();

publicRouter.use(
    "/swagger",
    swaggerUI.serve,
    swaggerUI.setup(swaggerDoc)
)

publicRouter.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

publicRouter.get("/ping", getPing);

publicRouter.get("/swagger", getSwagger);

module.exports = publicRouter;