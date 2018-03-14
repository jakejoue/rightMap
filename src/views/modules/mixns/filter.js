// 本地查询(筛选)

export default {
  data() {
    return {
      // 筛选用数据
      filterData: [],
      // 筛选用字段
      filterField: ['title']
    }
  },
  methods: {
    search(value) {
      this.data = this.filterData.filter(e =>
        this.filterField.some(a => {
          return e.hasOwnProperty(a) && e[a].toString().includes(value);
        })
      );
      if (!this.data.length) {
        this.$Message.info("没有查询到任何结果");
      }
    }
  }
}
