import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [{
    path: '/',
    component: () => import ("views/map.vue"),
    children: []
  }]
})
