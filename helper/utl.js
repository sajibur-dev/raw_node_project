const { createHmac } = require('crypto')
const environments = require('./environments')


const utl = {}

// parsed json 
utl.parseJson = (jsonStr) => {
    let output;

    try {
        output = JSON.parse(jsonStr)
    } catch {
        output = {}
    }

    return output;
}

// hashed str

utl.hash = str => {
    if(typeof str === 'string' && str.length > 0){
        const hashedStr = 
            createHmac('sha256',environments.secretKey)
            .update(str)
            .digest('hex')

        return hashedStr;
    } else {
        return false 
    }
}

module.exports = utl;