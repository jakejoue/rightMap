<template>
  <section id="layres">
    <header>图层控制</header>
    <CheckboxGroup v-model="selectedLayers" @on-change="change">
      <ul>
        <li v-for="(layer, i) in layers" :key="i">
          <Checkbox :label="layer.name"></Checkbox>
        </li>
      </ul>
    </CheckboxGroup>
  </section>
</template>

<script>
export default {
  data() {
    return {
      layers: [
        {
          name: "采集员"
        },
        {
          name: "车辆"
        },
        {
          name: "视频监控"
        }
      ],
      selectedLayers: ["采集员", "车辆", "视频监控"]
    };
  },
  methods: {
    change(layers) {}
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
