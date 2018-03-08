<template>
  <section id="layres">
    <header>图层控制</header>
    <CheckboxGroup v-model="selectedLayers" @on-change="change">
      <ul>
        <li v-for="(layer, i) in layers" :key="i">
          <Checkbox :label="layer.label"></Checkbox>
        </li>
      </ul>
    </CheckboxGroup>
  </section>
</template>

<script>
export default {
  data() {
    return {
      selectedLayers: []
    };
  },
  computed: {
    layers() {
      return this.$store.getters.ctrlLayer;
    }
  },
  methods: {
    change(layers) {}
  },
  watch: {
    // 监听layers，当其改变的时候默认选中所有图层
    layers: {
      handler(v) {
        this.selectedLayers = v.map(e => e.name);
      },
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
section#layres {
  width: 140px;
  header {
    text-align: center;
  }
  li {
    padding: 0 20px;
    .ivu-checkbox-wrapper {
      font-size: 15px;
    }
  }
}
</style>
