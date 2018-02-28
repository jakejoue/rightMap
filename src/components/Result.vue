<template>
  <section class="sr" v-show="indata.length > 0" :style="{'height':height}">
    <c-load :loading="loading"></c-load>
    <ul class="sr-ul" @scroll.passive="scrollPage" ref="list">
      <li v-for="(item, index) in indata" :key="index" @click="selectItem(item, index)" :class="[selectIndex==(page?item.index:index)?'select':'']">
        <section class="sr-ul-c">
          <aside v-if="showIndex">{{page?item.index+1:index+1}}</aside>
          <article>
            <slot :data="item"></slot>
          </article>
        </section>
      </li>
    </ul>
    <el-pagination v-if="page" class="page" layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page.sync="currentPage"></el-pagination>
  </section>
</template>

<script>
import cLoad from "./Loading";

function addIndex(start = 0, data = []) {
  let data_ = [];
  for (let i = 0; i < data.length; i++) {
    data_[i] = data[i];
    data_[i].index = start + i;
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
    // 是否显示左侧数标
    showIndex: { type: Boolean, default: true },
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
      indata: this.server ? [] : this.page ? [] : this.data,
      selectIndex: -1, //选中的元素编号
      currentPage: 1,
      total: this.server ? 0 : this.page ? 0 : this.data.length,
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
      async handler(newV, oldV) {
        this.loading = true;
        // 如果是动态获取数据
        if (this.server && this.getData) {
          // 如果该页未被请求
          if (!this.pages.has(newV) || !this.page) {
            // 请求数据
            const { data = [], total = 0 } = await this.getData({
              pageIndex: newV,
              pageSize: this.pageSize
            });
            // 如果需要分页
            if (this.page) {
              // 生成数据index
              let start = (newV - 1) * this.pageSize;
              let data_ = addIndex(start, data);
              this.pages.set(newV, data_);
              this.indata = this.pages.get(newV);
            } else {
              // 如果不需要分页
              this.indata.push(...data);
            }
            this.total == 0 && total > 0 && (this.total = total);
          } else {
            // 如果该页已被请求
            this.page && (this.indata = this.pages.get(newV));
          }
        } else {
          if (this.page) {
            this.total == 0 && (this.total = this.data.length);
            if (this.pages.size == 0) {
              let i = 1;
              while (this.data.length) {
                let start = (i - 1) * this.pageSize;
                let data = this.data.splice(0, this.pageSize);
                let data_ = addIndex(start, data);
                this.pages.set(i, data_);
                i++;
              }
            }
            this.indata = this.pages.get(newV);
          }
        }
        this.page && this.ul.scrollTop(0);
        this.loading = false;
      },
      immediate: true
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
    selectItem(item, index) {
      this.$emit("select", item);
      this.selectIndex = this.page ? item.index : index;
    }
  }
};
</script>

<style lang="less" scoped>
@import "basic.less";

section.sr {
  @li-hover: #f6f6f6;

  @index-color: red;
  @basic-color: #3385ff;

  .flex(column);
  > * {
    width: 100%;
  }

  padding-top: 10px;
  position: relative;

  ul.sr-ul {
    flex: 1;
    overflow-y: scroll;
    list-style-type: none;

    li {
      @label: 30px;
      cursor: pointer;
      padding: 6px 0;

      section.sr-ul-c {
        > aside {
          .align(center);
          color: @index-color;
        }
        > article {
          header {
            color: @basic-color;
          }
        }
      }

      &:hover,
      &.select {
        .bcolor(@li-hover);
        section {
          aside {
            color: @basic-color;
          }
        }
      }
      &.select {
        .bcolor(@basic-color);
      }
    }
  }
  .page {
    .reset;
    padding-top: 10px;
  }
}
</style>
