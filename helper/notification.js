const https = require('https')
const { stringify } = require('querystring')
const { twilio } = require('./environments')

const notification = {}

notification.sendTwilioSms = (phone,msg,callback) => {
    const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const userMsg = typeof msg === 'string' && msg.trim().length > 1 && msg.trim().length <= 1600 ? msg.trim() : false 

    if(userPhone && userMsg){
        const payload = {
            From:twilio.fromPhone,
            To:`+88${userPhone}`,
            Body:userMsg
        }

        const stringifyPayload = stringify(payload)

        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.AccountSid}/Messages.json`,
            auth: `${twilio.AccountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        const req = https.request(requestDetails,(res)=>{
            const status = res.statusCode;
            console.log(status);
            if (status === 200 || status === 201) {
                callback(false)
            } else {
                callback(`status code error ${status}`)
            }
        })
        req.on('error',(err)=>{
            callback(err)
        })
        req.write(stringifyPayload)
        req.end()

    } else {
        callback('please provide receiver phone number and message')
    }
}

module.exports = notification;