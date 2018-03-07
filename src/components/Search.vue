<template>
    <i-Input v-model="value"
        :icon="clear?'close':'search'"
        :size="size"
        :placeholder="placeholder"
        @on-click="h"
        @on-enter="h"
        @on-focus="clear=false"
    >
    </i-Input>
</template>

<script>
export default {
  props: {
    size: String,
    placeholder: String,
    search: Function,
    reset: Function
  },
  data() {
    this._search = this.search ? this.search : () => true;
    this._reset = this.reset ? this.reset : () => true;
    return {
      clear: false,
      value: ""
    };
  },
  computed: {
    input() {
      return $(this.$el).children("input");
    },
    icon() {
      return $(this.$el).children("i");
    }
  },
  methods: {
    async h() {
      if (this.clear) {
        const flag = await this._reset();
        if (flag === true || flag === undefined) {
          this.value = "";
          this.clear = false;
        }
      } else {
        this.input.blur();
        if (this.value.trim()) {
          const flag = await this._search(this.value);
          this.clear = flag === true || flag === undefined;
        } else {
          this.$Message.warning("请输入关键字");
        }
      }
    }
  }
};
</script>