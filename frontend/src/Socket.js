import {io} from "socket.io-client"

export class Socket {
    constructor() {
        this.socket = io("http://172.31.48.1:80")
    }

    createRoom(roomId, userLogin) {
        this.socket.emit("room", [roomId, userLogin])
    }


    resiveMessage(store) {
        this.socket.on("message", (data) => {
            if (typeof data !== "string") {
                data.push(this.getTime())
            } 
            store.commit("pushMessage", data)           
            
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

    getTime() {
        return new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() 
      }
}
    
