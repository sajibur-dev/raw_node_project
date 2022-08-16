

const controller = {}

controller.notFoundRouteController = (requestedPropereties,callback) => {
    callback(404,{
        msg:'route was not found'
    })
}

module.exports = controller