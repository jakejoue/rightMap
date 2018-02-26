// import search from './search.vue';

export default {
  modules: [{
      title: "搜索",
      img: "static/img/search_24.png",
      module: () => import ('./search.vue')
    }
  ]
}
