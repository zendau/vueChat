<template>
  <div class="chat__container">
    <section class="section__users">
      <h1>Users online</h1>
      <ul class="users__list">
        <li v-for="user in users" :key="user.id">{{user.login}}</li>
      </ul>
    </section>
    <section class="section__chat">
      <div class="chat__header">
        <button><span class="material-icons">reorder</span></button>
        <button><span class="material-icons">logout</span></button>
        <h2>Room id - {{roomId}}</h2>
      </div>
    
      <div class="chat__messages" v-if="messages.length !== 0">
        <ul class="messages">
          <li v-for="(item, index) in messages" :key="index" class="message" :class="item['id'] === userId ? 'message--active' : ''">
            <div v-if="item['id'] !== undefined" class="message__container">
              <p 
                class="login" 
                >{{item["login"]}}
              </p>
              <div class="body__message" :class="item['id'] === userId ? 'message--active' : ''">
                <p>{{item["message"]}}</p>
                <p class="time"><small>{{item['time']}}</small></p>
              </div>
            </div>
            <div v-else>
              <p class="user__enter">{{item["message"]}}</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="chat__send">
        <input type="text" placeholder="message" v-model="userMessage">
        <button @click="sendMessage"><span class="material-icons">send</span></button>
      </div>

    </section>
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

  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
  @import url("https://fonts.googleapis.com/icon?family=Material+Icons");

  .chat__container {
    display: flex;
  }

  .section {
    &__users {
      min-width: 25%;
      font-family: 'Roboto', sans-serif;
      background-color: #f6e6e4;
      height: 100vh;

      h1 {
        margin-top: 30px;
        text-align: center;
      }
    }

    &__chat {
      font-family: 'Roboto', sans-serif;
    }
  }

  .users__list {
    list-style: none;
    padding: 0;
    li {
      text-align: center;
    }
  }

  .section__chat {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .chat__header {
    display: flex;
    align-items: center;
    background-color: #ffeedb;
    height: 10%;
    width: 100%;

    button {
      border: none;
      background-color: inherit;
      cursor: pointer;
      min-width: 35px;
      min-height: 35px;
      max-height: 35px;
      padding: 0;
      margin-right: 20px;
      span {
        font-size: 35px;
      }
    }

    h2 {
        margin: 0;
        font-family: 'Roboto', sans-serif;
        margin-left: 25px;
    }
  }

  .user__enter {
    text-align: center;
  }

  .chat__messages {
    height: 80%;
  }

  .body__message {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }

  .chat__send {
    height: 10%;
    font-family: 'Roboto', sans-serif;
    display: flex;
    height: 50px;
    input {
      width: 85%;
      font-size: 24px;
    }
    button {
      width: 15%;
      font-size: 24px;
      text-align: center;
    }
  }

  //
  .messages {
    width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    max-height: 600px;
    overflow-y: auto;
    list-style: none;
    padding: 0;

  }
  .message {
    
    font-size: 18px;
    width: 600px;
    align-self: flex-end;
    background-color: rgb(201, 201, 201);

    &__container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }

  .login {
    margin-right: 15px;
    color: gray;
  }
  .message--active {
    background-color: burlywood;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .time {
    margin-left: 10px;
  }

</style>