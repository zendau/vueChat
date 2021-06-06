import { createStore } from 'vuex'

export default createStore({
  state: {
    userLogin: null,
    messages: []
  },
  mutations: {
    authUser(state, data) {
      state.userLogin = data[0]
    },
    pushMessage(state, message) {
      console.log(state.messages)
      state.messages.push({
        login: message[0],
        message: message[1],
        time: message[2]
      })
    }
  },
  actions: {
  },
  modules: {
  }
})
