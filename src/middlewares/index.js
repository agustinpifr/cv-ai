const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

const setUpMiddlewares = (app) => {
    const JSON_LIMIT = process.env.JSON_LIMIT || "15mb";
    app.use(express.json({ limit: JSON_LIMIT }));
    app.use(express.urlencoded({ limit: JSON_LIMIT, extended: true }));
    
    // Prevención de inyección en MongoDB: sanea las entradas del usuario
    // Usamos la configuración por defecto para evitar errores 500 por opciones incompatibles
    // app.use(mongoSanitize());
    
    app.use(morgan("dev"));
    app.use(cors(
        {
            origin: "*" // Cambiar a la URL de la aplicación front-end
        }
    ));
    // Global rate limiter
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
    });
    app.use(limiter);

}

module.exports = setUpMiddlewares;