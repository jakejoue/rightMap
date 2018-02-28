<template>
    <Spin fix v-show="loading">
        <Icon type="load-c" :size="iconSize" class="loading"></Icon>
        <div :style="{'font-size':fontSize+'px'}">Loading</div>
    </Spin>
</template>

<script>
export default {
  name: "cLoad",
  props: {
    loading: { type: Boolean, default: false },
    iconSize: { type: Number, default: 30 },
    fontSize: { type: Number, default: 20 }
  }
};
</script>


<style lang="less" scoped>
@import "basic.less";
</style>
