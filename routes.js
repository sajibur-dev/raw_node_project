const { aboutRouteController } = require("./controller/aboutRouteController")
const { userRouteController } = require("./controller/userRouteController")



const routes = {
    about : aboutRouteController,
    user : userRouteController
}

module.exports = routes