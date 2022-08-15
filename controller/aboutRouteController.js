

const controller = {}

controller.aboutRouteController = (requestedPropereties,callback) => {
    callback(200,{
        msg:'about route works successfull'
    })
}

module.exports = controller