<template>
  <div id="layres">
    <header>图层控制</header>
    <CheckboxGroup v-model="sLayers" @on-change="change">
      <ul>
        <li v-for="(layer, i) in layers" :key="i">
          <Checkbox :label="layer.label"></Checkbox>
        </li>
      </ul>
    </CheckboxGroup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sLayers: []
    };
  },
  computed: {
    layers() {
      return this.$store.state.ctrlLayers;
    }
  },
  methods: {
    change() {
      this.layers.forEach(e => {
        const { label, layer } = e;
        layer.setVisible(this.sLayers.includes(label));
      });
    }
  },
  watch: {
    layers(layers) {
      this.sLayers = [];
      layers.forEach(e => {
        const { label, layer } = e;
        layer.getVisible() && this.sLayers.push(label);
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
    padding-left: 20px;
    .ivu-checkbox-wrapper {
      font-size: 15px;
    }
  }
}
</style>
