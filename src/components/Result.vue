<template>
  <section class="sr" v-show="indata.length > 0" :style="{'height':height}">
    <c-load :loading="loading"></c-load>
    <ul class="sr-ul" @scroll.passive="scrollPage" ref="list">
      <li v-for="(item, index) in indata"
        :key="index"
        :class="[selectIndex==item.index?'select':'']"
        @click="selectItem(item)">
        <slot :data="item.target"></slot>
      </li>
    </ul>
    <el-pagination
      v-if="page"
      class="page"
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="currentPage">
    </el-pagination>
  </section>
</template>

<script>
import cLoad from "./Loading";

function addIndex(start = 0, data = []) {
  let data_ = [];
  for (let i = 0; i < data.length; i++) {
    data_.push({
      index: start + i,
      target: data[i]
    });
  }
  return data_;
}

export default {
  name: "cResult",
  components: {
    cLoad
  },
  props: {
    height: { type: String, default: "300px" },
    // 数据
    data: { type: Array, default: [] },
    // 每页大小
    pageSize: { type: Number, default: 10 },
    // 是否启动分页标签，为false变成滚动分页（不影响服务器分页）
    page: { type: Boolean, default: true },
    // 是否是服务器分页
    server: { type: Boolean, default: false },
    // 服务器分页获取数据的方法
    getData: { type: Function }
  },
  data() {
    return {
      indata: [],
      selectIndex: -1, //选中的元素编号
      currentPage: 1,
      total: 0,
      pages: new Map(),
      loading: false
    };
  },
  computed: {
    truePageCount() {
      return Math.ceil(this.indata.length / this.pageSize);
    },
    ul() {
      return this.$(this.$refs.list);
    }
  },
  watch: {
    currentPage: {
      handler(newV, oldV) {
        this.refresh(newV);
      },
      immediate: true
    },
    getData() {
      this.refresh(1);
    },
    data() {
      this.refresh(1);
    }
  },
  methods: {
    // 滚动分页
    scrollPage(...rest) {
      if (!this.page && this.server) {
        let b =
          this.ul[0].scrollHeight - this.ul.height() - this.ul.scrollTop();
        this.indata.length < this.total &&
          Math.abs(b) <= 1 &&
          this.currentPage++;
      }
    },
    selectItem(item) {
      this.$emit("select", item);
      this.selectIndex = item.index;
    },
    async refresh(newV) {
      this.loading = true;
      // 如果是动态获取数据
      if (this.server && this.getData) {
        // 如果该页未被请求
        if (!this.pages.has(newV) || !this.page) {
          // 请求数据
          const { data = [], total = 0 } =
            (await this.getData({
              pageIndex: newV,
              pageSize: this.pageSize
            })) || {};
          // 如果需要分页
          if (this.page) {
            // 生成数据index
            let start = (newV - 1) * this.pageSize;
            let data_ = addIndex(start, data);
            this.pages.set(newV, data_);
            this.indata = this.pages.get(newV);
          } else {
            // 如果不需要分页(滚动请求的肯定是下一页)
            this.indata.push(...addIndex(this.indata.length, data));
          }
          this.total == 0 && total > 0 && (this.total = total);
        } else {
          // 如果该页已被请求
          this.page && (this.indata = this.pages.get(newV));
        }
      } else {
        if (this.page && this.data.length > 0) {
          this.total == 0 && (this.total = this.data.length);
          if (this.pages.size == 0) {
            let i = 1;
            const _data = [...this.data];
            while (_data.length) {
              let start = (i - 1) * this.pageSize;
              let data = _data.splice(0, this.pageSize);
              this.pages.set(i, addIndex(start, data));
              i++;
            }
          }
          this.indata = this.pages.get(newV);
        } else {
          this.indata = addIndex(0, this.data);
        }
      }
      this.page && this.ul.scrollTop(0);
      this.loading = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import "basic.less";
@import "config.less";

section.sr {
  .flex(column);
  > * {
    width: 100%;
  }

  padding-top: 10px;
  position: relative;

  ul.sr-ul {
    flex: 1;
    min-height: 250px;
    overflow-y: scroll;
    list-style-type: none;

    li {
      cursor: pointer;
      .result;
    }
  }

  .page {
    .reset;
    padding-top: 10px;
  }
}
</style>
