<template>
  <div>
    <router-view/>
  </div>
</template>

<script>

import {onMounted, provide} from "vue"
import {Socket} from "./Socket"

export default {
  setup() {
    onMounted(() => {
      const SocketClass = new Socket()
      provide("SocketClass", SocketClass)
    })
  },
}
</script>

<style lang="scss">
body {
  background-color: #dddddd;
  margin: 0;
}
</style>

