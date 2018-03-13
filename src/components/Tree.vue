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
    showCheckbox: { type: Boolean, default: false }
  },
  data() {
    return {
      selectIndex: -1,
      deepArr: [],
      checkedData: [],
      iconMap: new Map()
    };
  },
  methods: {
    renderContent(h, { root, node, data }) {
      data.icon && this.iconMap.set(data.nodeKey, data.icon);
      const icon = this.iconMap.get(node.parent);
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
          <span>{data.title}</span>
        </span>
      );
    },
    checkChange(data) {
      this.checkedData = data;
      this.$emit("on-check-change", data, this.filterData);
    },
    filterData(deep, key) {
      if (!deep && !key) return this.checkedData;
      deep = Number.isInteger(deep) ? deep : this.deepArr.length - 1;
      const deepNodekey = this.deepArr[deep];
      if (!deepNodekey) {
        return [];
      } else {
        console.log(deepNodekey);
        return this.checkedData.filter(e => {
          let flag = deepNodekey.includes(e.nodeKey);
          let flag2 = true;
          key && (flag2 = !!e[key]);
          return flag && flag2;
        });
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(...rest) {
        this.iconMap = new Map();
        let deepArr = [],
          nodeKey = 0;
        function buildDeepMap(nodeData, deep = 0) {
          !deepArr[deep] && (deepArr[deep] = []);
          deepArr[deep].push(nodeKey);
          nodeKey++;
          if (Array.isArray(nodeData.children)) {
            nodeData.children.forEach(data => buildDeepMap(data, deep + 1));
          }
        }
        this.data.forEach(data => buildDeepMap(data));
        this.deepArr = deepArr;
      }
    }
  }
};
</script>