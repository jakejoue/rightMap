// 通用部分（查询相关）
import cResult from "c/Result";
import cSearch from "c/Search";
import cTree from "c/Tree";
import { Select, Option } from 'iview';

/**
 * search 模块，包含search，reset方法，placeholder变量
 * 前后有formAppend(Height),formPrepend(Height)用于追加html，height用于计算结果集高度
 * 
 * select 模块，数据源typeList，结果绑定为type，有typeChange方法
 * 前面有typeLabel用于追加描述信息
 * 
 * tip 模块，有搜索结果时隐藏，没有时显示(用于搜索前提示，不计入高度)，推荐只需要进行搜索时候使用
 * 
 * splitLine 分割线
 * 
 * tree 模块，数据源treeData，判断条件hasTree（默认显示，data不为空时隐藏）
 * 属性：field（显示用字段名）treeCheckable（显示可选框）
 * 方法：treeClick（节点被选中）treeCheck（被选中节点有变）
 * 
 * result 模块，数据源data，判断条件hasResult（data为空默认不显示）
 * 属性：page（分页），showTotal（在上方显示总条数和总页数）
 * 方法：select（结果被选中），pageChange（分页时触发）
 * getResT方法，返回结果的模板
 */

export default {
  components: {
    cResult,
    cSearch,
    cTree
  },
  data() {
    return {
      data: [],
      hasResult: true,
      treeData: [],
      hasTree: true,

      splitLine: true,
      formAppendHeight: 0,
      formPrependHeight: 0,
      placeholder: '',

      layer: null,
      visible: true
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
  watch: {
    type: {
      handler(value) {
        if (this.refresh) {
          clearInterval(this.refresh);
          setInterval(this.refresh, parseInt(value) * 1000);
        }
      },
      immediate: true
    }
  },
  // 初始化地图图层
  created() {
    // layerId是layer的id，没有设置将不会初始化图层
    const { layerId, label } = this.$options;
    if (layerId) {
      // 如果存在图层，不创建，否则默认创建一个矢量图层
      if (!this.layer) {
        this.layer = new KMap.GraphicsLayer(layerId);
      }
      // 可见性
      this.layer.setVisible(this.visible);
      // 存在label，表示需要被图层管理控件控制
      if (label) {
        this.$store.commit('addCtrlLayer', {
          label, layer: this.layer
        });
      }
      this.infoTemplate && (this.layer.setInfoTemplate(this.infoTemplate));
      map.addGraphicsLayer(this.layer);
    }
  },
  mounted() {
    this.refresh && this.refresh();
  },
  methods: {
    async search_(value) {
      map.infoWindow.hide();
      this.search && await this.search(value);
    },
    async reset_() {
      this.data = [];
      map.infoWindow.hide();
      this.reset && this.reset();
    },
    select({ target }) {
      const graphic = target.graphic;
      // 统一赋值为方法
      graphic && centerShow({ graphic: graphic() });
    },
    // 空方法，避免报错
    pageChange(data) { },
    treeClick({ graphic }) {
      // iview tree对象循环有bug，可能会造成栈溢出，所以这里调用方法
      graphic && centerShow({ graphic: graphic() });
    },
    treeCheck(data, filter) { }
  },
  render(h) {
    return (
      <div>
          { this.formPrepend ? this.formPrepend : '' }
          <c-search ref="cSearch" size="large" search={this.search_} reset={this.reset_} placeholder={this.placeholder}></c-search>
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
            {
              this.hasTree ?
                <c-tree
                  v-show={!this.data.length && this.treeData.length}
                  data={this.treeData}
                  field={this.field}
                  onOn-click={this.treeClick}
                  show-checkbox={this.treeCheckable}
                  onOn-check-change={this.treeCheck}>
                </c-tree> : ''
            }
            {
              this.hasResult ? 
                <c-result
                  ref="cResult"
                  className={this.$options.moduleName}
                  data={this.data}
                  page={this.page}
                  onSelect={this.select}
                  onPage-change={this.pageChange}
                  show-total={this.showTotal}
                  scopedSlots={{
                    default: ({data})=> {
                      return this.getResT ? this.getResT(data) : '';
                    }
                  }}>
                </c-result> : ''
            }
          </div>
      </div>
    );
  }
};