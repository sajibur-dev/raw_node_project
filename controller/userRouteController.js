const { hash } = require("../helper/utl")
const { read, create } = require("../lib/data")


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
    const firstName = typeof requestedPropereties.body.firstName === 'string' && requestedPropereties.body.firstName.trim().length > 0 ? requestedPropereties.body.firstName : false;

    const lastName = typeof requestedPropereties.body.lastName === 'string' && requestedPropereties.body.lastName.trim().length > 0 ? requestedPropereties.body.lastName : false;

    const phone = typeof requestedPropereties.body.phone === 'string' && requestedPropereties.body.phone.trim().length === 11 ? requestedPropereties.body.phone : false;

    const password = typeof requestedPropereties.body.password === 'string' && requestedPropereties.body.password.trim().length > 0 ? requestedPropereties.body.password : false;

    const tosAgreement = typeof requestedPropereties.body.tosAgreement === 'boolean' ? requestedPropereties.body.tosAgreement : false;

    const savedUser = {
        firstName,
        lastName,
        phone,
        password:hash(password),
        tosAgreement 
    }

    if(firstName && lastName && phone && password && tosAgreement){
        read('users',phone,(err)=>{
            if(err){
                create('users',phone,savedUser,(err)=>{
                    if(!err){
                        callback(200,{
                            msg:'data saved is successfull'
                        })
                    } else {
                        callback(500,{
                            error:'server side error'
                        })
                    }
                })
            } else {
                callback(500,{
                    error:'file already exist'
                })
            }
        })
    } else {
        callback(400,{
            msg:'bad requeset'
        })
    }
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