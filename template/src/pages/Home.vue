<template lang="pug">
  div.container
    img(src="public/logo.png", style="width: 200px; height: 200px")
    h1 Vue.js 🔥 Server Side Rendering 🔥 template
    p  ⚡️ Blazing fast UX and performant SSR boilerplate mostly inspired by vue hackernews example. ⚡️
    br
    p Example below is data fetched asynchronously using
      code asyncData()
    p It means that this data will be fetched on
      b  server
      span  first and saved to the store
    div.example-container

</template>

<script>
export default {


  /**
   * Выгружаем метатеги страницы
   */
  metaInfo() {
    return {
      title: 'Site Title',
      titleTemplate: "",
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: "Site desc",
        },
      ],
      htmlAttrs: {
        lang: 'ru',
        //amp: true
      }
    }
  },


  /**
   *   Получить данные на стороне сервера, которые будут добавлены на страницу для указанного Route
   *   Страница не будет отдана клиенту, пока все промисы asyncData со всех компонентов не будут разрешены
   *   Этот модуль позволяет загрузить на страницу конкретный объект в состояние
   *   В этом модуле надо применить мутацию к store, чтобы данные для страницы добавились к новому отдаваемому экземпляру
   * @param store
   * @param route
   */
  asyncData ({ store, route }) {

    // Загружаем в домашнюю страницу списки планов
    store.commit('setHome');

  },


  computed: {
  },


  mounted () {
  },

}

</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  margin: 1rem;
}
h1 {
  font-weight: 400;
  color: #455a64;
  margin-bottom: .5rem;
}
p {
  font-size: 1.25rem;
}

.example-container {
  display: flex;
  flex-flow: column;
  margin: 2rem;
  border-radius: 4px;
  border: 1px solid #651FFF;
  padding: 1rem;
}
.currency-item {
  display: inline-flex;
  font-size: 1.25rem;
  font-family: 'Roboto';
  margin-bottom: .25rem;
}
.currency-item > .name {
  width: 10rem;
  flex: 1;
}
</style>
