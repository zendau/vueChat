<template>
  <div class="chat__container">
    <section v-show="sideMenu" class="section__users">
      <h1>Users online</h1>
      <ul class="users__list">
        <li v-for="user in users" :key="user.id">{{user.login}}</li>
      </ul>
    </section>
    <section class="section__chat">
      <div class="chat__header">
        <button @click="sideMenuShow"><span class="material-icons">reorder</span></button>
        <button @click="exitEvent"><span class="material-icons">logout</span></button>
        <h2>Room id - {{roomId}}</h2>
      </div>
    
      <div class="chat__messages">
        <ul class="messages" ref="messagesRef">
          <li v-for="(item, index) in messages" :key="index" class="message">
            <div v-if="item['id'] !== undefined" class="message__container"  :class="item['id'] === userId ? 'message--active' : ''">
              <p 
                class="login" 
                >{{item["login"]}}
              </p>
              <div class="body__message">
                <p class="message__content">{{item["message"]}}</p>
                <p class="time"><small>{{item['time']}}</small></p>
              </div>
            </div>
            <div class="message--enter" v-else>
              <p class="user__enter">{{item["message"]}}</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="chat__send">
        <input type="text" placeholder="Message" v-model.trim="userMessage">
        <button class="send__btn" @click="sendMessage"><span class="material-icons">send</span></button>
      </div>

    </section>
  </div>
</template>

<script>


import {onMounted, ref, reactive, inject, computed, nextTick} from "vue"
import {useStore} from "vuex"
import {useRouter} from "vue-router"

export default {

  setup() {

    let socket = null

    const userMessage = ref("")
    const store = useStore()
    const router = useRouter()

    const sideMenu = ref(true)

    const messagesRef = ref(null)


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
        socket.resiveMessage(store, function () {
            return nextTick(() => {
            const elem = messagesRef.value
            elem.scrollTo(0, elem.scrollHeight)        
          })
        })
        socket.getUserId(userId, store)
        socket.getUsers(store)
      }
    })

    function sendMessage() {

      if (this.userMessage.length > 0) {
        socket.sendMessage([this.userLogin, this.userMessage, this.roomId, this.userId])
        this.userMessage = ""
      }
    }


    function sideMenuShow() {
      this.sideMenu = !this.sideMenu
    }

    function exitEvent() {
      socket.logoutUser()
      router.push("/")
      store.state.userLogin = null
      store.state.userId = null
      store.state.roomId = null
      store.state.messages = []
      store.state.users = []
    }

    

    return {
      userMessage,
      userLogin,
      sendMessage,
      messages,
      roomId,
      userId,
      users: computed(() => store.state.users),
      sideMenuShow,
      sideMenu,
      messagesRef,
      exitEvent
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
      box-shadow: 4px 0px 10px 0px rgba(34, 60, 80, 0.06);

      h1 {
        margin-top: 30px;
        text-align: center;
      }
    }

    &__chat {
      font-family: 'Roboto', sans-serif;
      width: 100%;
      height: 100vh;
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
    min-height: 10%;
    width: 100%;
    box-shadow: 0px 5px 10px 0px rgba(34, 60, 80, 0.06);

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
    margin: 0px;
  }

  .chat__messages {
    max-height: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .body__message {
    display: flex;
    width: 100%;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 5px;
    p {
      margin: 0;
    }
  }

  .chat__send {
    font-family: 'Roboto', sans-serif;
    display: flex;
    height: 50px;
    box-shadow: 0px 0px 17px -2px rgba(34, 60, 80, 0.2);
    input {
      width: 85%;
      font-size: 24px;
      outline: none;
      border: 1px solid #f6e6e4;
      padding: 0 5px;
      &:focus {
        border: 2px solid #125d98;
        
      }
    }
    button {
      width: 15%;
      font-size: 24px;
      text-align: center;
    }
  }

  //
  .messages {
    width: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    max-height: 600px;
    overflow-y: auto;
    list-style: none;
    padding: 0;
    min-height: 100%;
    padding-top: 15px;
    box-sizing: border-box;

  }
  .message {
    margin: 15px;
    margin-top: 0;
    font-size: 18px;
    border-radius: 5px;


    &__container {
      display: flex;
      flex-direction: column;
      background-color: rgb(201, 201, 201);
      margin-left: auto;
      width: 600px;
      border-radius: 5px;
      padding: 5px;

    }
  }

  .message--enter {
    margin: 0 auto
  }

  .login {
    margin: 5px;
    margin-right: 15px;
    color: #343a40;
  }
  .message--active {
    background-color: burlywood;
    margin-right: auto;
    margin-left: 0;
  }

  .message__content {
    word-break: break-all;
  }

  .send__btn {
    border: none;
    background-color: #125d98;
    color: #fff;
    cursor: pointer;
    line-height: 14px;
  }

  .time {
    margin-left: 10px;
  }

</style>