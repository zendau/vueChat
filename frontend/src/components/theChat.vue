<template>
  <div>
    <h1>Users online</h1>
    <p v-for="user in users" :key="user.id">{{user.login}}</p>
    <h1>Send message</h1>
    <h2>Hello {{userLogin}}</h2>
    <h2>Room id - {{roomId}}</h2>
    <h2>User id - {{userId}}</h2>
    <input type="text" placeholder="message" v-model="userMessage">
    <button @click="sendMessage">Send</button>
    <div v-if="messages.length !== 0">
      <h1 >Receive message</h1>
      <ul class="messages">
        <li v-for="(item, index) in messages" :key="index" class="message">
          <p 
            class="login" 
            :class="item['id'] === userId ? 'login--active' : ''"
            >{{item["login"]}}:
          </p>
          <p>{{item["message"]}}</p>
          <p class="time"><small>{{item['time']}}</small></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>


import {onMounted, ref, reactive, inject, computed} from "vue"
import {useStore} from "vuex"
import {useRouter} from "vue-router"

export default {

  setup() {

    let socket = null

    const userMessage = ref(null)
    const store = useStore()
    const router = useRouter()


    const messages = reactive(store.state.messages)

    const roomId = store.state.roomId
    const userLogin = store.state.userLogin
    const userId = ref(null)

    onMounted(() => {

      
      if (userLogin === null) {
        router.push("/")
      } else {
        socket = inject("SocketClass")

        socket.createRoom(roomId, userLogin)
        socket.resiveMessage(store)
        socket.getUserId(userId, store)
        socket.getUsers(store)
      }

     


    })

    function sendMessage() {
      socket.sendMessage([this.userLogin, this.userMessage, this.roomId, this.userId])
      this.userMessage = ""
    }

    

    return {
      userMessage,
      userLogin,
      sendMessage,
      messages,
      roomId,
      userId,
      users: computed(() => store.state.users)
    }
  }
}

</script>


<style lang="scss" scoped>
  .messages {
    width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 600px;
    overflow-y: auto;
  }
  .message {
    display: flex;
    font-size: 18px;
  }

  .login {
    margin-right: 15px;
    color: gray;
  }
  .login--active {
    color:blue;
  }

  .time {
    margin-left: 10px;
  }

</style>