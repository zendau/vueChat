const express = require('express')
const app = express()
const http = require('http').Server(app)

const initSocket = require("./initSocket")

const io = require('socket.io')(http, {
    cors: {
      credentials: true
    }
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get('/', (req, res) => {
  res.json("ok")
});


const PORT = process.env.PORT || 80

const ifaces = require('os').networkInterfaces()
const localhost = Object.keys(ifaces).reduce((host,ifname) => {
    let iface = ifaces[ifname].find(iface => !('IPv4' !== iface.family || iface.internal !== false))
    return iface? iface.address : host
}, '127.0.0.1')

http.listen(PORT, () => {
    console.log(`server started on http://${localhost}:${PORT}`)
    initSocket(io)
})