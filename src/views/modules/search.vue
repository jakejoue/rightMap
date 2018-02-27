<template>
  <div>
    <input type="text">
    <button>提交</button>
    <result :data="lists" @select="select" :page="true" :server="true" :get-data="getData">
      <template slot-scope="{ data }">
        <header class="head" @click="cc">{{ data.name }}</header>
        <article>{{ data.description }}</article>
        <footer>end</footer>
      </template>
    </result>
  </div>
</template>

<script>
import result from "@/components/results/index";

export default {
  components: { result },
  data() {
    this.$on("show", () => {
      console.log("show");
    });
    this.$on("close", () => {
      console.log("close");
    });
    return {
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
    select(data) {
      console.log(data);
    },
    cc() {
      console.log("cc");
    },
    getData() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            data: this.lists.map(e => Object.assign({}, e)),
            total: 100
          });
        }, 1000);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.head {
  width: 100%;
}
</style>
