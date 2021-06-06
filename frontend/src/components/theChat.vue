<template>
  <div>
    <h1>Send message</h1>
    <input type="text" placeholder="message" v-model="userMessage">
    <button @click="sendMessage">Send</button>
    <div v-if="messages.length !== 0">
      <h1 >Receive message</h1>
      <ul class="messages">
        <li v-for="(item, index) in messages" :key="index" class="message">
          <p 
            class="login" 
            :class="item['login'] === userLogin ? 'login--active' : ''"
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

import {io} from "socket.io-client"
import {onMounted, ref, reactive} from "vue"
import {useStore} from "vuex"
import {useRouter} from "vue-router"

export default {

  setup() {

    let socket = null

    const userMessage = ref(null)
    const userLogin = ref(null)
    const store = useStore()
    const router = useRouter()


    const messages = reactive(store.state.messages)


    onMounted(() => {

      userLogin.value = store.state.userLogin

      if (userLogin.value === null) {
        router.push("/")
      } else {
        socket = io("http://172.21.112.1:80")
            socket.on("message", (data) => {
              data.push(getTime())
              store.commit("pushMessage", data)
            })
      }


    })

    function sendMessage() {
      socket.emit("newMessage", [store.state.userLogin, this.userMessage])
      this.userMessage = ""
    }

    function getTime() {
      return new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() 
    }

    return {
      userMessage,
      userLogin,
      sendMessage,
      messages,
      getTime
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