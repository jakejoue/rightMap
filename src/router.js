import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter);

import map from 'views/map.vue';

export default new VueRouter({
  routes: [{
    path: '/',
    component: map,
    children:[]
  }]
})
