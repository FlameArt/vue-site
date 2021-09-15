import Vue from 'vue'

export default {

  /**
   * Установить произвольный компонент состояния
   * @param state
   * @param variable
   * @param value
   */
  set (state, [variable, value]) {
    state[variable] = value
  },

  setHome(state, data) {

    // Загружаем любые данные на стороне сервера, вызывается из Home->asyncData
    // Vue.set(state, 'objects', SERVER_PRELOADED_DATA.objects);

  },

}
