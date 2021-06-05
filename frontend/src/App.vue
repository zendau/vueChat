<template>
  <div>
      <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>

import {io} from "socket.io-client"
import {onMounted} from "vue"

export default {

  setup() {

    onMounted(() => {
      const socket = io("http://172.21.112.1/")
      socket.on('message', (data) => {
        console.log(data)
      })
    })


    return
  }
}
</script>
