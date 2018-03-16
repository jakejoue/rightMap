<template>
    <div class="slider unselectble">
        <div class="sliderBar unselectble" :style="{'width':width}">
            <div class="bar" :style="{'width':offset+'px'}"></div>
            <div class="leftGrip hand unselectble"
                :style="{'left':offset+'px'}"
                @mousedown.stop="drag_ev1"
                @mousemove.stop="drag_ev2"
                @mouseup.stop="drag_ev3"
            ></div>
        </div>
        <span v-show="showTxt" class="unselectble">{{`&nbsp;${InerPercent}%`}}</span>
    </div>
</template>

<script>
export default {
  name: "sliderBar",
  props: {
    width: { default: "200px" },
    percent: { default: 0 },
    showTxt: { default: true }
  },
  data() {
    this.InerWidth = parseFloat(this.width) - 15;
    return {
      drag: false,
      x: 0, //上一个点（计算偏移量）
      offset: 0, //偏移量（计算百分百）
      InerPercent: 0
    };
  },
  methods: {
    //拖动百分百条
    drag_ev1(e) {
      if (e.button == 0) {
        this.drag = true;
        this.x = e.x;
        this.$emit("beforeSet", this.InerPercent);
      }
    },
    drag_ev2(e) {
      if (this.drag) {
        if (e.which == 1) {
          this.offset += e.x - this.x;
          this.x = e.x;
          if (this.offset < 0) {
            this.offset = 0;
            this.drag_ev3();
          }
          if (this.offset > this.InerWidth) {
            this.offset = this.InerWidth;
            this.drag_ev3();
          }
          this.InerPercent = parseInt(this.offset / this.InerWidth * 100, 10);
        } else {
          this.drag_ev3();
        }
      }
    },
    drag_ev3(e) {
      this.drag = false;
      this.x = 0;
      this.$emit("setProgress", this.InerPercent);
    }
  },
  watch: {
    percent: {
      handler(value) {
        value = Number.parseInt(value, 10);
        if (value >= 0 && value <= 100) {
          this.InerPercent = value;
          this.offset = this.InerWidth * (value / 100);
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.slider > div {
  float: left;
  vertical-align: middle;
}

.sliderBar {
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
  position: relative;
  height: 15px;
  background: #dbdce0;
}

.sliderBar > div {
  position: absolute;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
  background: #29aee9;
}

.sliderBar .bar {
  height: 7px;
  top: 4px;
  left: 7.5px;
}

.leftGrip {
  width: 15px;
  height: 13px;
  border: 1px solid gray;
}

.hand {
  cursor: move;
}

.unselectble {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>