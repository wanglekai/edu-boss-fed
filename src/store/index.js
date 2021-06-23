import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 当前用户的登陆状态
    user: JSON.parse(window.localStorage.getItem('user') || null),
    breadListState: []
  },
  mutations: {
    // 登陆后将用户信息 保存到本地存储中
    setUser (state, playlod) {
      state.user = JSON.parse(playlod)
      window.localStorage.setItem('user', playlod)
    },
    breadListMutations (getters, list) {
      getters.breadListState = list
    }
  },
  actions: {
  },
  modules: {
  }
})
