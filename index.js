const http = require('http')
const environment = require('./helper/environments')
const {handleReqRes} = require('./helper/handleReqRes')

const app = {}

app.config = {
    port : 5000
}

app.createServer = () => {
    const server = http.createServer(app.handleReqRes)
    server.listen(environment.port,()=>console.log(`server is running ${environment.port}`))
}

app.handleReqRes = handleReqRes

app.createServer()