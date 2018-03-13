<template>
    <Tree class="c-tree"
      :data="data"
      :load-data="loadData"
      :render="renderContent"
      :style="{'height': height}"
      :show-checkbox="showCheckbox"
      :class="[showCheckbox?'checkable':'']"
      @on-check-change="checkChange">
    </Tree>
</template>

<script>
import { Icon } from "iview";

export default {
  props: {
    height: { type: String, default: "100%" },
    data: { type: Array, default: () => [] },
    loadData: Function,
    showCheckbox: { type: Boolean, default: false },
    field: { type: String, default: "title" }
  },
  data() {
    return {
      selectIndex: -1,
      checkedData: []
    };
  },
  methods: {
    renderContent(h, { root, node, data }) {
      const icon = data.icon;
      return (
        <span
          onClick={() => {
            this.selectIndex = data.nodeKey;
            this.$emit("on-click", data);
          }}
          class={`c-tree-node${
            this.selectIndex == data.nodeKey ? " select" : ""
          }${icon ? " icon" : ""}`}
        >
          {icon ? (
            <img src={icon} />
          ) : (
            <Icon type={data.children ? "folder" : "document"} />
          )}
          <span>{data[this.field]}</span>
        </span>
      );
    },
    checkChange(data) {
      this.checkedData = data;
      this.$emit("on-check-change", data, this.filter);
    },
    filter(param) {
      return this.checkedData.filter(e => e[param]).map(e => e[param]);
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(...rest) {
        // 生成deep数据
        let nodeKey = 0;
        function buildDeepMap(nodeData, deep = 0) {
          nodeData.deep = deep + 1;
          nodeKey++;
          if (Array.isArray(nodeData.children)) {
            nodeData.children.forEach(data => buildDeepMap(data, deep + 1));
          }
        }
        this.data.forEach(data => buildDeepMap(data));
      }
    }
  }
};
</script>