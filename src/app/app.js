const express = require("express");
const setUpMiddlewares = require("../middlewares");
const setUpRoutes = require("../routes");

const createApp = () => {
    const app = express();
    setUpMiddlewares(app);
    setUpRoutes(app);
    return app;
}

module.exports = createApp;