<template>
    <section class="c-drag" v-show="show" :style="{'left':x+'px','top':y+'px'}" :class="className" @mousedown="refresh">
        <header @mousedown="drag_ev1" @mousemove="drag_ev2" @mouseup="drag_ev3" :class="`${className}-header`">
            <slot name="title" class="title"></slot>
        </header>
        <article :class="`${className}-article`">
            <slot name="content" class="title"></slot>
        </article>
    </section>
</template>

<script>
let [x, y] = [0, 0];
let [offset_x, offset_y] = [0, 0];

export default {
  props: {
    show: { type: Boolean, default: true },
    left: { type: Number, default: 0 },
    top: { type: Number, default: 0 },
    className: { type: String, default: "c-drag" }
  },
  data() {
    return {
      drag: false,
      x: this.left,
      y: this.top
    };
  },
  watch: {
    show: {
      handler() {
        this.show && this.refresh();
      },
      immediate: true
    }
  },
  methods: {
    refresh() {
      $(".c-drag").css("z-index", 100);
      $(this.$el).css("z-index", 101);
    },
    drag_ev1(e) {
      if (e.button == 0) {
        this.drag = !this.drag ? true : false;
        [x, y] = [e.x, e.y];
      }
    },
    drag_ev2(e) {
      if (this.drag) {
        if (e.which == 1) {
          [offset_x, offset_y] = [e.x - x, e.y - y];
          [x, y] = [e.x, e.y];
          this.x += offset_x;
          this.y += offset_y;
        } else {
          this.drag_ev3();
        }
      }
    },
    drag_ev3(e) {
      this.drag = false;
    }
  }
};
</script>

<style lang="less" scoped>
section.c-drag {
  position: absolute;
  z-index: 101;
  header {
    cursor: move;
    user-select: none;
  }
}
</style>

