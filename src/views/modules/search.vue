<template>
  <div id="search">
    <c-search size="large" :search="search" :reset="reset"></c-search>
    <Select v-model="type" size="small" style="width:100px; margin-top:5px;">
      <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <p v-show="tip">使用上面的查询框，根据名称来查询要素。</p>
    <c-result :data="data" @select="select" height="calc(100% - 65px)" show-total=true>
      <template slot-scope="{ data }">
        <header>{{ data.name }}</header>
        <article>{{ data.description }}</article>
        <footer>end</footer>
      </template>
    </c-result>
  </div>
</template>

<script>
import cResult from "@/components/Result";
import cSearch from "@/components/Search";

export default {
  components: { cResult, cSearch },
  data() {
    this.$on("show", () => {
      console.log("show");
    });
    this.$on("close", () => {
      console.log("close");
    });
    return {
      tip: true,
      data: [],
      type: "兴趣点",
      typeList: [
        { value: "兴趣点", label: "兴趣点" },
        { value: "道路", label: "社区" },
        { value: "街道办", label: "街道办" },
        { value: "行政区", label: "行政区" },
        { value: "工作网格", label: "工作网格" },
        { value: "单元网格", label: "单元网格" }
      ],
      lists: [
        {
          name: "titleA",
          description: "哈哈哈哈哈哈"
        },
        {
          name: "titleB",
          description: "啊啊啊啊啊啊"
        },
        {
          name: "titleC",
          description: "哇哇哇哇哇哇"
        },
        {
          name: "titleA",
          description: "哈哈哈哈哈哈"
        },
        {
          name: "titleB",
          description: "啊啊啊啊啊啊"
        },
        {
          name: "titleC",
          description: "哇哇哇哇哇哇"
        },
        {
          name: "titleA",
          description: "哈哈哈哈哈哈"
        },
        {
          name: "titleB",
          description: "啊啊啊啊啊啊"
        },
        {
          name: "titleC",
          description: "哇哇哇哇哇哇"
        },
        {
          name: "titleA",
          description:
            "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈"
        }
      ]
    };
  },
  methods: {
    search(value) {
      this.tip = false;
      this.data = this.lists;
    },
    reset() {
      this.tip = true;
      this.data = [];
    },
    select(data) {
      console.log(data);
    }
  }
};
</script>

<style lang="less" scoped>

</style>
