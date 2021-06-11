import {io} from "socket.io-client"

export class Socket {
    constructor() {
        this.socket = io("http://172.31.48.1:80")
    }

    createRoom(roomId, userLogin) {
        console.log("socket", this.socket)
        if (!this.socket.connected) {
            this.reconnect()
        }
        this.socket.emit("room", [roomId, userLogin])
    }


    resiveMessage(store, fun) {
        this.socket.on("message", (data) => {
            if (typeof data !== "string") {
                data.push(this.getTime())
            } 
            store.commit("pushMessage", data)           
            fun()
        })
    }

    getUserId(userId, store) {
        this.socket.on("getUserId", (id) => {
            if (userId.value === "" || userId.value === null) {
              store.commit("setUserId", id)
              userId.value =  store.state.userId
            }
        })
    }

    getUsers(store) {
        this.socket.on("getUsers", (users) => {
            store.commit("saveUsers", users)
            console.log(users)
        })
    }

    sendMessage(params) {
        this.socket.emit("newMessage", params)
    }

    logoutUser() {
        this.socket.emit("logoutUser")
    }

    reconnect() {
        this.socket = io("http://172.31.48.1:80")
    }

    getTime() {
        return new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() 
      }
}
    
