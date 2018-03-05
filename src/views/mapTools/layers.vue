<template>
    <section>
        <header>图层控制</header>
        <CheckboxGroup v-model="layers">
            <ul>
                <li>
                    <Checkbox label="采集员"></Checkbox>
                </li>
                <li>
                    <Checkbox label="车辆"></Checkbox>
                </li>
                <li>
                    <Checkbox label="视频监控"></Checkbox>
                </li>
            </ul>
        </CheckboxGroup>
    </section>
</template>

<script>
export default {
  data() {
    return {
      layers: ['采集员', '车辆', '视频监控']
    };
  }
};
</script>

<style lang="less" scoped>
section {
  width: 130px;
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
