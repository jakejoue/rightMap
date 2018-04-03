<template>
  <div class="c-search">
    <i-Input v-model="value"
      icon="search"
      :size="size"
      :placeholder="placeholder"
      @on-click="s"
      @on-enter="s"
    >
    </i-Input>
    <Icon v-show="clear" class="ivu-input-icon close" :class="size" type="close-circled" @click.native="r"></Icon>
  </div>
</template>

<script>
export default {
  props: {
    size: String,
    placeholder: String
  },
  data() {
    return {
      clear: false,
      value: ""
    };
  },
  computed: {
    input() {
      return $(this.$el).find("div>input");
    }
  },
  methods: {
    async s() {
      this.input.blur();
      if (this.value.trim()) {
        this.$emit("search", this.value);
        this.clear = true;
      } else {
        this.$Message.warning("请输入关键字");
      }
    },
    async r() {
      this.value = "";
      this.clear = false;
      this.input.focus();
      this.$emit("reset", this.value);
    },
    focus() {
      this.input.focus();
    }
  }
};
</script>

<style lang="less">
.c-search {
  position: relative;
  .ivu-input-icon + .ivu-input {
    padding-right: 50px;
  }
  > .ivu-input-icon.close {
    position: absolute;
    top: 0;
    width: 15px;
    right: 32px;
    font-size: 13px;
    &.small {
      right: 24px;
      height: 24px;
      line-height: 24px;
    }
    &.large {
      height: 36px;
      line-height: 36px;
    }
  }
}
</style>
