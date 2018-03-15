<template>
  <div id="legend">
    <ul v-if="legend.length">
      <p>图例</p>
      <li v-for="item in legend" :key="item.label">
        <img :src="item.icon">
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    legend() {
      return this.$store.state.legend;
    }
  }
};
</script>

<style lang="less" scoped>
div#legend {
  width: 200px;
  ul {
    padding-left: 5px;
  }
}
</style>

