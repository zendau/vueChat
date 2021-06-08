const express = require('express')
const app = express()
const http = require('http').Server(app)

const {addUser, getRoomUser} = require("./users")

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


// Вывод сообщение что был подключен пользователь по сокету
io.on("connection", (socket) => {
    console.log("user connect")
    console.log(socket.rooms)

    socket.on("room", (userData) => {

        const user = {
            id: socket.id,
            room: userData[0],
            login: userData[1]
        }

        addUser(user)
        socket.join(user.room)
        io.to(user.room).emit("getUserId", user.id)
        io.to(user.room).emit("getUsers", getRoomUser(user.room))

            
        
    })

    socket.on('newMessage', (msg) => {
        console.log(`message ${msg[1]} from user ${msg[0]}, room ${msg[2]}`)
        console.log("msg", msg)
        io
            .to(msg[2]+"")
            .emit("message", msg)  
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
})


const PORT = process.env.PORT || 80

const ifaces = require('os').networkInterfaces();
    const localhost = Object.keys(ifaces).reduce((host,ifname) => {
        let iface = ifaces[ifname].find(iface => !('IPv4' !== iface.family || iface.internal !== false));
        return iface? iface.address : host;
    }, '127.0.0.1');
    http.listen(PORT, () => {
        console.log(`server started on http://${localhost}:${PORT}`)
})