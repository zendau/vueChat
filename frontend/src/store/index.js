import { createStore } from 'vuex'

export default createStore({
  state: {
    userLogin: null,
    userId: null,
    roomId: null,
    messages: [],
    users: []
  },
  mutations: {
    authUser(state, data) {
      state.userLogin = data[0]
      state.roomId = data[1] + ""
    },
    setUserId(state, id) {
      state.userId = id
    },
    pushMessage(state, message) {
      console.log(state.messages)
      state.messages.push({
        login: message[0],
        message: message[1],
        id: message[3],
        time: message[4],
      })
    },
    saveUsers(state, users) {
      state.users = users
      console.log(state.users)
    }
  },
  actions: {
  },
  modules: {
  }
})
