# Vue SSR + PWA + REST template

Blazing fast Vue template for modern site creation

## Features
- Fast SSR with 7ms response and 97% LightHouse performance score on production
- Promise-based `REST` module for [**Yii2** ActiveControllers](https://github.com/FlameArt/auto-rest-template-yii2) included in Server&Client global space
- Scalable architecture from small to large projects
- Server Preloaded state from `REST` for extremly fast fill client state 
- **Pug** - **SCSS**  - **Vue-router** - **Vuex** under the hood!
- Best `SEO` support with [vue-meta](https://github.com/declandewet/vue-meta)
- Auto-generated service worker for **PWA** support on production
- External `config.json` for select `REST` server params on dev&prod for each project

### Getting started

```
npm i -g @vue/cli
npm i -g @vue/cli-init
vue init FlameArt/vue-site project-name
cd project-name
npm install
npm run dev
```

Open [http://localhost:7070/](http://localhost:7070/)

###### Production
```
cd project-name
npm install
npm run build
npm start
```

##Usage

Global variables `IS_SERVER` and `IS_BROWSER`, class `REST` and module `fetch` defined everywhere.

###### Fill client State

Each component has asyncData module, which can load any state only in that component. Usage: 

```
  asyncData ({ store, route }) {
    return new Promise((res,rej)=>{
      this.$store.commit(...)
    })
  },
  
  or
  
  asyncData ({ store, route }) {
      return axios({}).than(data=>{
        this.$store.commit(...)
      })
    },
```

After resolve all promises from each component - page will send to client

###### Preloaded state

You can fill state in asyncData from PRELOADED server state. It is much more performant, than get state from REST for each request.

First, you need define REST data for preload in `src/store/server-preload.js` and optionally - change reload interval (default 30 min)

You get global object `SERVER_PRELOADED_DATA` - use it in any place in your code. Example fill client state from store `/src/store/index.js`:

```
  return new Vuex.Store({
    state: {
      
      objects: IS_SERVER ? SERVER_PRELOADED_DATA.objects : [],
  
    },
    actions,
    mutations,
    getters
  })
```

## REST

Globally defined `REST` class (for server and client) is using to requests to [Yii2-based REST services](https://www.yiiframework.com/doc/guide/2.0/en/rest-quick-start). 

I create template for Yii2 REST with auto-generator for DB and some features here: https://github.com/FlameArt/auto-rest-template-yii2

You can use methods:

`REST.get(table,whereParams,returnFields,sortFields, page, perPage)`

or just

`REST.get(table)`

also you can use:

```
REST.create
REST.remove
REST.edit
```

Class define `REST.REST_SERVER` from `/src/config.json` and have default pagination params

## Notices
This is a project template for old version [vue-cli](https://github.com/vuejs/vue-cli).
Even if you have version 3 of vue-cli, you can install `@vue/cli-init`

And use it as you used before.

If port 7070 is already in use on your machine you must change the port number in `.env`. Otherwise `npm run dev` will fail.

## License

Based on [xrei/vue-ssr](https://github.com/xrei/vue-ssr)

MIT