const http = require('http')
const environments = require('./helper/environments')
const {handleReqRes} = require('./helper/handleReqRes')

const app = {}

app.createServer = () => {
    const server = http.createServer(app.handleReqRes)
    server.listen(environments.port,()=>console.log(`server is running ${environments.port}`))
}

app.handleReqRes = handleReqRes

app.createServer()