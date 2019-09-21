import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      
      // Любые объекты, которые должны быть предзагружены из быстрого состояния сервера (через asyncData каждой страницы)
      // objects: [],
  
      // Ссылка на REST, загружаемая в зависимости от client\server \\ dev\prod
      REST_server: IS_BROWSER ? "" : (SERVER_IS_PROD ? SERVER_CONFIG.prod.REST_SERVER : SERVER_CONFIG.dev.REST_SERVER),
  
    },
    actions,
    mutations,
    getters
  })
}
