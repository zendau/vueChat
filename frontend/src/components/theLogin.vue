<template>
  <div>
      <form>
          <input type="text" placeholder="Print your login" v-model="login">
          <input type="text" placeholder="Print id room" v-model="roomId">
          <button  
            :status=checkRoomId 
            @click.prevent="userLogin">
            {{checkRoomId ? "Enter the chat" : "Create new room"}}
        </button>
      </form>
  </div>
</template>

<script>

import {mapMutations} from "vuex"

export default {
    data() {
        return {
            login: "",
            roomId: ""
        }
    },
    methods: {
        ...mapMutations([
            "authUser"
        ]),
        userLogin() {
            if (!this.checkRoomId) {
                this.roomId = Date.now()
            } else {
                console.log(this.roomId)
                this.authUser([this.login, this.roomId])
                this.$router.push("/chat")
            }
        }
    },
    computed: {
        checkRoomId() {
            return this.roomId !== ""
        }
    }
}
</script>

<style>

</style>