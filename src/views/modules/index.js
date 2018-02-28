// import search from './search.vue';

export default {
  modules: [{
      title: "查询",
      img: "static/img/search_24.png",
      module: () => import ('./search.vue')
    }
  ]
}