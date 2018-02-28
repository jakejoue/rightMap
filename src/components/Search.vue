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
    !this.search && (this._search = () => true);
    !this.reset && (this._reset = () => true);
    return {
      clear: false,
      value: ""
    };
  },
  computed: {
    input() {
      return this.$(this.$el).children("input");
    },
    icon() {
      return this.$(this.$el).children("i");
    }
  },
  methods: {
    async h() {
      if (this.clear && (await this._reset())) {
        this.value = "";
        this.clear = false;
      } else {
        this.input.blur();
        if (this.value.trim()) {
          this.clear = await this._search();
        } else {
          alert("请输入关键字");
        }
      }
    }
  }
};
</script>