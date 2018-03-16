//轨迹播放操作窗口
<template>
  <c-drag className="ctrack" :show="inerShow">
    <p class="title" slot="title">
      {{ targetName }}
      <big @click.stop="$store.commit('track/close')" class="close">×</big>
    </p>
    <div class="content" slot="content">
      <Row span=24>
        <i-Col span=4>
          <Button type="primary" size="small" @click="playFuc">{{play?'暂停':'播放'}}</Button>
        </i-Col>
        <i-Col span=12>
          <c-SliderBar width="150px" :percent="percent" @beforeSet="beforeSet" @setProgress="setProgress"></c-SliderBar>
          <p class="unselectble">{{attr.time}}</p>
        </i-Col>
        <Button type="primary" size="small" :class="[backwardflag?'selected':'']" @click="changeSpeed(backwardflag = true)">快退X{{backward}}</Button>
        <Button type="primary" size="small" :class="[!backwardflag?'selected':'']" @click="changeSpeed(backwardflag = false)">快进X{{forward}}</Button>
      </Row>
      <Row v-show="car">
        <p>
          <span class="carButton unselectble" @click="span=!span">{{span?'详情信息':'简要信息'}}
            <Icon :type="span?'arrow-down-b':'arrow-up-b'"></Icon>
          </span>
        </p>
        <i-Col v-show="!span" class="carDetail" :span="24">
          <table>
            <tr>
              <td>
                <b>速度：</b>
              </td>
              <td>{{attr.speedStr}}</td>
              <td>
                <b>方向：</b>
              </td>
              <td>{{attr.directionStr}}</td>
            </tr>
            <tr>
              <td>
                <b>ACC：</b>
              </td>
              <td>{{attr.acc}}</td>
              <td>
                <b>是否定位：</b>
              </td>
              <td>{{attr.bLocate}}</td>
            </tr>
            <tr>
              <td>
                <b>报警：</b>
              </td>
              <td colspan="3">{{attr.alarmStr}}</td>
            </tr>
          </table>
          <i-Col span=8>
            <Checkbox v-model="zhiliuV" @change="zhiliu" size="large">显示滞留点</Checkbox>
            <br>
            <Checkbox v-model="baojinV" @change="baojin" size="large">显示报警点</Checkbox>
          </i-Col>
          <i-Col span=16>
            <span style="float:left;font-size:14px;line-height:23px">停留标识：</span>
            <Select v-model="value" size="small" @change="zhiliu" style="width:100px">
              <Option label="9分钟" value="9"></Option>
              <Option label="3分钟" value="3"></Option>
              <Option label="5分钟" value="5"></Option>
              <Option label="15分钟" value="15"></Option>
              <Option label="20分钟" value="20"></Option>
              <Option label="30分钟" value="30"></Option>
            </Select>
          </i-Col>
        </i-Col>
      </Row>
    </div>
  </c-drag>
</template>

<script>
import cDrag from "c/Drag";
import cSliderBar from "c/SliderBar";
//轨迹操作类
import obsTrack from "./js/obsTrack";
import carTrack from "./js/carTrack";

import { mapState } from "vuex";

export default {
  components: { cDrag, cSliderBar },
  data() {
    return {
      inerShow: false,
      targetName: "",
      play: false, //是否播放
      backwardflag: false,
      forward: 2, //向前播放
      backward: 2, //向后播放
      percent: 0,
      //一些信息（可更新的）
      attr: {},
      interOBJ: null,
      car: true, //是否显示车辆操作栏
      span: true, //车辆详情是否缩在一起
      value: "9",
      zhiliuV: false,
      baojinV: false
    };
  },
  computed: {
    ...mapState({
      show: state => state.track.show,
      type: state => state.track.type,
      time: state => state.track.time,
      target: state => state.track.target
    })
  },
  methods: {
    //播放
    playFuc() {
      this.play = !this.play;
      if (this.play) {
        this.interOBJ.play();
      } else {
        this.interOBJ.pause();
      }
    },
    //更改速度
    changeSpeed(flag) {
      if (!flag) {
        //调用正放代码
        this.forward = this.forward >= 8 ? 1 : this.forward * 2;
        this.interOBJ.setSpeed(this.forward);
        this.interOBJ.setDirection(true);
      } else {
        //调用倒放代码
        this.backward = this.backward >= 8 ? 1 : this.backward * 2;
        this.interOBJ.setSpeed(this.backward);
        this.interOBJ.setDirection(false);
      }
    },
    // 滞留点
    zhiliu() {
      if (this.car) {
        if (this.zhiliuV) {
          this.interOBJ.showRetentionPoint(parseInt(this.value));
        } else {
          this.interOBJ.showRetentionPoint();
        }
      }
    },
    //报警点
    baojin() {
      if (this.car) {
        this.interOBJ.showAlarmPoint(this.baojinV, e => {
          //请求失败回掉函数
          this.baojinV = false;
        });
      }
    },
    //百分比设置回掉函数
    beforeSet() {
      this.interOBJ.beforeSet();
    },
    setProgress(value) {
      this.percent = value;
      this.interOBJ.setProgress(value);
    },
    initView() {
      this.targetName = "";
      this.inerShow = this.play = this.backwardflag = false;
      this.percent = 0;
      this.value = "9";
      this.zhiliuV = this.baojinV = false;
      this.forward = this.backward = 2;
      this.car = false;
      this.span = true;
      this.attr = {};
    }
  },
  watch: {
    show(value) {
      if (this.show) {
        this.initView();
        //显示操作栏并进行初始化
        this.car = this.type == "car";
        const trackClass = !this.car ? obsTrack : carTrack;
        this.interOBJ = new trackClass({
          play: e => {
            this.play = true;
          },
          pause: e => {
            this.play = false;
          },
          update: (e, attr) => {
            this.percent = e.getPercent();
            this.attr = attr;
          },
          error: e => {
            this.loading(false);
            this.interOBJ = null;
            this.$store.commit("track/close");
            if (typeof e == "string") {
              this.$Message.warning(e);
            } else {
              this.$Message.error("查询数据出错");
            }
            return;
          },
          initSuccess: e => {
            this.loading(false);
            this.inerShow = true;
            e.play();
          }
        });
        const target = this.target;
        const time = this.time;
        this.interOBJ.setTarget(target);
        this.interOBJ.setTime(time.sTime, time.eTime);
        this.targetName = !this.car
          ? target.getAttribute("name")
          : target.getAttribute("gpsName");
        //播放轨迹（正确初始化进行操作框显示）
        this.loading(true, "正在查询轨迹数据...");
        this.interOBJ.playTrack();
      } else {
        //隐藏操作栏
        if (this.interOBJ) {
          this.interOBJ.stop();
          this.interOBJ = null;
        }
        this.inerShow = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ctrack {
  width: 410px;
  border-radius: 5px;
  background-color: #fff;

  .unselectble {
    user-select: none;
  }
  button {
    padding: 3px 8px;
    font-size: 13.333333px;
    background-color: #52bff7;
  }
  button.selected {
    background-color: #309bcd;
  }

  .title {
    border-radius: 5px 5px 0 0;
    padding: 5px 10px;
    margin: 0;
    font-size: 14px;
    color: white;
    background-color: rgb(48, 155, 205);
    .close {
      float: right;
      cursor: pointer;
      font-weight: bold;
    }
  }

  .content {
    border: 1px solid gray;
    border-top: none;
    border-radius: 0 0 5px 5px;
    padding: 10px;

    .carButton {
      cursor: pointer;
      float: right;
      height: 20px;
      font-size: 13.33333px;
    }
    .carDetail {
      margin-top: 10px;
      table {
        width: 100%;
        margin-bottom: 10px;
        border-collapse: collapse;
        tr {
          width: 100%;
          height: 30px;
          border-bottom: 1px solid gray;
          td:nth-child(odd) {
            width: 20%;
          }
          td:nth-child(even) {
            width: 30%;
          }
        }
      }
      b {
        font-size: 15px;
      }
    }
  }
}
</style>
