<template>
  <div class="c-result" :class="[className?className:'']" v-show="indata.length > 0" :style="{'height':height}">
    <big v-show="page&&showTotal">共{{total}}条，共{{pageCount}}页</big>
    <c-load :loading="loading_"></c-load>
    <ul v-if="!page && server" class="c-result-ul" :class="className?className+'-ul':''" @scroll.passive="scrollPage" ref="list">
      <li v-for="item in indata"
        :key="item.index"
        :class="[selectIndex==item.index?'select':'']"
        @click="selectItem(item)">
        <slot :data="item.target"></slot>
      </li>
    </ul>
    <ul v-else class="c-result-ul" :class="className?className+'-ul':''" ref="list">
      <li v-for="item in indata"
        :key="item.index"
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
  </div>
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
    // 用于样式的覆盖
    className: { type: String },
    height: { type: String, default: "100%" },
    // 数据
    data: { type: Array, default: () => [] },
    // 每页大小
    pageSize: { type: Number, default: 10 },
    // 是否启动分页标签，为false变成滚动分页（不影响服务器分页）
    page: { type: Boolean, default: false },
    // 分页模式下是否显示头部总数
    showTotal: { type: Boolean, default: false },
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
      loading_: false,
      ul: $(this.$refs.list)
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.total / this.pageSize);
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
      this.selectIndex = -1;
      this.pages = new Map();
      this.total = 0;
      this.currentPage = 1;
      this.refresh(1);
    },
    data() {
      this.selectIndex = -1;
      this.pages = new Map();
      this.total = 0;
      this.currentPage = 1;
      this.refresh(1);
    }
  },
  methods: {
    // 滚动分页
    scrollPage() {
      const ul = this.ul;
      let b = ul[0].scrollHeight - ul.height() - ul.scrollTop();
      this.indata.length < this.total && Math.abs(b) <= 1 && this.currentPage++;
    },
    // 选中事件
    selectItem(item) {
      this.$emit("select", item);
      this.selectIndex = item.index;
    },
    // 分页刷新
    async refresh(newV) {
      this.loading_ = true;
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
      if (this.page) {
        this.ul.scrollTop(0);
        this.$emit("page-change", {
          currentPage: this.currentPage,
          pageData: this.indata
        });
      }
      this.loading_ = false;
    }
  },
  mounted() {
    this.ul = $(this.$refs.list);
  }
};
</script>
