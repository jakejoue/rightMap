// import search from './search.vue';

export default {
  modules: [{
      title: "查询",
      img: "static/img/search_24.png",
      module: () => import ('./search.vue')
    },
    {
      title: "人员监控",
      img: "static/img/tracker_40.png",
      module: () => import ('./observer.vue')
    }
  ]
}