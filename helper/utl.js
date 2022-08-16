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

// hashed str

utl.createRandomStr = strLen => {
    let strLength = typeof strLen === 'number' && strLen > 0 ? strLen : false
    if(strLength){
        const possibleChar = 'abcdefghijklmnopqrstuvwxyz123456789'
        const possibleCharLen = possibleChar.length
        let output = ''
        for(let i =1;i<=strLength;i++){
            const randomChar = possibleChar.charAt(Math.floor(Math.random() * possibleCharLen));
            output += randomChar
        }
        return output;
    }
    return false;
}

module.exports = utl;