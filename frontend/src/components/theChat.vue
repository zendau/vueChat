<template>
  <div class="chat__container">

    <users :sideMenu=sideMenu></users>
    
    <section class="section__chat">
      <header-chat 
          :socket=socket
          :roomId=roomId
          @menu="sideMenuShow"
      ></header-chat>

      <div class="chat__messages">
        
        <messages 
          :userId=userId
          :socket=socket
          @msgRef="getMsgRef"
        ></messages>
   
      </div>

      <send 
        :userLogin=userLogin 
        :roomId=roomId 
        :userId=userId 
        :socket=socket
      ></send>

    </section>
  </div>
</template>

<script>


import {onMounted, ref, reactive, inject, nextTick} from "vue"
import {useStore} from "vuex"
import {useRouter} from "vue-router"

import headerChat from "../views/header.vue"
import messages from "../views/messages.vue"
import send from "../views/send.vue"
import users from "../views/users.vue"

export default {

  components: {
    headerChat,
    messages,
    send,
    users
  },

  setup() {

    const socket = reactive({})

    const store = useStore()
    const router = useRouter()
    const sideMenu = ref(true)

    const messagesRef = ref(null)
        

    const roomId = store.state.roomId

    
    const userLogin = store.state.userLogin
    const userId = ref(null)

    onMounted(() => {

      if (userLogin === null) {
        router.push("/")
      } else {
        socket.data = inject("SocketClass")

        socket.data.createRoom(roomId, userLogin)
        socket.data.getUserId(userId, store)
        socket.data.getUsers(store)
        socket.data.resiveMessage(store, function () {
            return nextTick(() => {
            const elem = messagesRef.value
            elem.value.scrollTo(0, elem.value.scrollHeight)        
          })
        })
      }
    })

    function sideMenuShow() {
      sideMenu.value = !sideMenu.value
    }

    function getMsgRef(msgRef) {
      messagesRef.value = msgRef
    }

    return {
      userLogin,
      roomId,
      userId,
      sideMenuShow,
      sideMenu,
      socket,
      getMsgRef
    }
  }
}

</script>


<style lang="scss">

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
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .chat {

    &__container {
      display: flex;
    }



    &__messages {
      max-height: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    &__send {
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
  }
  

</style>