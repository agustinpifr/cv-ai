const publicRouter = require("./public.router");
const authRouter = require("./auth.router");
const privateRouter = require("./private.router");
const authMiddleware = require("../middlewares/auth.middleware");


const setUpRoutes = (app) => {
    //Rutas públicas
    app.use("/", publicRouter);
    app.use("/auth", authRouter);

    // Middleware de autenticación
    app.use(authMiddleware);

    // Rutas privadas
    app.use("/v1", privateRouter);
}

module.exports = setUpRoutes;