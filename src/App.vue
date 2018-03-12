<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    <rightMap></rightMap>
  </div>
</template>

<script>
import rightMap from "views/map.vue";

export default {
  components: { rightMap }
};
</script>

<style lang="less">
@import "basic.less";

html,
body,
#app {
  .full;
  overflow: hidden;
}
</style>
