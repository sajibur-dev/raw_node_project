const { aboutRouteController,userRouteController,tokenRouteController,checksRouteController } = require("./controller")




const routes = {
    about : aboutRouteController,
    user : userRouteController,
    token:tokenRouteController,
    checks:checksRouteController
}

module.exports = routes