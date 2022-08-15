

const controller = {}

controller.userRouteController = (requestedPropereties,callback) => {
    const expectedMethod = ['get','post','put','delete']
    if(expectedMethod.includes(requestedPropereties.method)){
        controller._user[requestedPropereties.method](requestedPropereties,callback)
    } else {
        callback(400,{
            msg:'method not allowed'
        })
    }
    
}

controller._user = {}

controller._user.post = (requestedPropereties,callback) => {
    callback(200,{
        msg:'post route'
    })
}


controller._user.get = (requestedPropereties,callback) => {
    callback(200,{
        msg:'get route'
    })
}


controller._user.put = (requestedPropereties,callback) => {
    callback(200,{
        msg:'put route'
    })
}

controller._user.delete = (requestedPropereties,callback) => {
    callback(200,{
        msg:'delete route'
    })
}

module.exports = controller