const getPing = (req, res) => {
    res.send("pong");
};

const getSwagger = (req, res) => {
    res.send("Api para Swagger");
};

module.exports = {
    getPing,
    getSwagger
}