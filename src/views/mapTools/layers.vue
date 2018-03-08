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
      return this.$store.state.ctrlLayers;
    }
  },
  methods: {
    change(layers) {}
  },
  watch: {
    layers(layers) {
      this.selectedLayers = [];
      layers.forEach(({ label, layer }) => {
        layer.getVisible() && this.selectedLayers.push(label);
      });
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
