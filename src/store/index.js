import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: ''
  },
  mutations: {
    setToken: (state, token) => {
      state.token = token
    }
  },
  actions: {
    setToken: (content, token) => {
      content.commit('setToken', token)
    }
  },
  modules: {}
})
