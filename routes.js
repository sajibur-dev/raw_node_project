const { aboutRouteController,userRouteController,tokenRouteController } = require("./controller")




const routes = {
    about : aboutRouteController,
    user : userRouteController,
    token:tokenRouteController
}

module.exports = routes