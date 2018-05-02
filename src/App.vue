<template>
  <div id="app">
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
