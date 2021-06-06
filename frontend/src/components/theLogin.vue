<template>
  <div>
      <form>
          <input type="text" placeholder="Print your login" v-model="login">
          <button @click.prevent="userLogin">Start</button>
      </form>
  </div>
</template>

<script>

import {mapMutations} from "vuex"

export default {
    data() {
        return {
            login: ""
        }
    },
    methods: {
        ...mapMutations([
            "authUser"
        ]),
        userLogin() {
            this.authUser([this.login])
            this.$router.push("/chat")
        }
    }
}
</script>

<style>

</style>