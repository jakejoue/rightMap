// import search from './search.vue';

export default {
  modules: [{
    title: "搜索",
    module: () => import('./search.vue')
  }]
}
