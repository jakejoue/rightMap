// 通用部分（查询相关）
import cResult from "@/components/Result";
import cSearch from "@/components/Search";
import cTree from "@/components/Tree";
import { Select, Option } from 'iview';

export default {
  components: {
    cResult,
    cSearch,
    cTree
  },
  data() {
    return {
      data: [],
      splitLine: true,
      formAppendHeight: 0,
      formPrependHeight: 0,
      placeholder: ''
    }
  },
  computed: {
    height() {
      const height = `calc(100% - ${
        36 +
        (this.typeList ? 32.8 : 0) +
        (this.splitLine ? 10 : 0) +
        8 +
        (this.formPrepend ? this.formPrependHeight : 0) +
        (this.formAppend ? this.formAppendHeight : 0)
        }px)`;
      return height;
    }
  },
  methods: {
    search(data) {
      return false;
    },
    reset() {
      this.data = [];
    },
    select(data) { },
    treeClick(data) { },
    treeCheck(data, filter) { }
  },
  render(h) {
    return (
      <div>
          { this.formPrepend ? this.formPrepend : '' }
          <c-search size="large" search={this.search} reset={this.reset} placeholder={this.placeholder}></c-search>
          {
            (this.typeList && this.typeList.length) ? 
            <div class="typeSelect">
                { this.typeLabel ? <label>{this.typeLabel}：</label> : '' }
                <Select v-model={this.type} onOn-change={this.typeChange} size="small" style="width:100px;">
                {
                  this.typeList.map(item => {
                    return <Option value={item.value} key={item.value}>{ item.label }</Option>
                  })
                }
                </Select>
            </div> : ''
          }
          { this.formAppend ? this.formAppend : '' }
          { this.tip ? <p class="tip" v-show={!this.data.length}>{this.tip}</p> : '' }
          <hr v-show={this.splitLine} style={{marginTop:"8px"}}/>
          <div class="full" style={ Object.assign({marginTop:"8px"}, {height:this.height}) }>
              <c-result
                data={this.data}
                page={this.page}
                onSelect={this.select}
                show-total={this.showTotal}
                scopedSlots={{
                  default: ({data})=> {
                    return this.getResT ? this.getResT(data) : '';
                  }
                }}>
              </c-result>
              {
                this.treeData ?
                  <c-tree
                    v-show={!this.data.length && this.treeData.length}
                    data={this.treeData}
                    onOn-click={this.treeClick}
                    getIcon={this.getIcon}
                    show-checkbox={this.treeCheckable}
                    onOn-check-change={this.treeCheck}>
                  </c-tree> : ''
              }
          </div>
      </div>
    );
  }
};