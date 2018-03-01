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
      data: []
    }
  },
  methods: {
    search(data) {
      return false;
    },
    reset() {
      this.data = [];
    },
    select(data) {
      console.log(data);
    },
    treeClick(data) {
      console.log(data);
    }
  },
  render(h) {
    return (
      <div>
          <c-search size="large" search={this.search} reset={this.reset}></c-search>
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
                { this.selectAppend ? this.selectAppend : '' }
            </div> : ''
          }
          { this.tip ? <p class="tip" v-show={!this.data.length}>{this.tip}</p> : '' }
          <div class="full" style="height:calc(100% - 60px)">
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
                    v-show={!this.data.length}
                    data={this.treeData}
                    onOn-click={this.treeClick}>
                  </c-tree> : ''
              }
          </div>
      </div>
    );
  }
};