const { sendTwilioSms } = require("./helper/notification");
const { createRandomStr } = require("./helper/utl");


sendTwilioSms('01830394432','hello world',(res)=>{
    console.log('res is',res);
})