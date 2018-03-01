<template>
    <Tree class="c-tree"
      :data="data"
      :load-data="loadData"
      :render="renderContent"
      :style="{'height': height}">
    </Tree>
</template>

<script>
import { Icon } from "iview";

export default {
  props: {
    height: { type: String, default: "100%" },
    data: { type: Array, default: () => [] },
    loadData: Function,
    getIcon: { type: Function, default: () => "document" }
  },
  data() {
    return { selectIndex: -1 };
  },
  methods: {
    renderContent(h, { root, node, data }) {
      return (
        <span
          onClick={() => {
            this.selectIndex = data.nodeKey;
            this.$emit("on-click", data);
          }}
          class={
            this.selectIndex == data.nodeKey
              ? "c-tree-node select"
              : "c-tree-node"
          }
        >
          <Icon type={data.children ? "folder" : this.getIcon(data)} />
          <span>{data.title}</span>
        </span>
      );
    }
  }
};
</script>