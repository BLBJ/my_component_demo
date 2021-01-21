<template>
  <div
    class="wrap"
    :style="getWrapperHeight"
    @mousedown.stop.prevent="mousedown"
    @mouseup.stop.prevent="mouseup"
    @mousemove.stop.prevent="mousemove"
    @touchstart="listenerTouchStart"
    @touchmove="listenerTouchMove"
    @touchend="listenerTouchEnd"
  >
    <ul class="wheel" :style="getListTop" ref="wheel">
      <li
        class="item"
        :index="item.index"
        v-for="(item, index) in scrollValues"
        :key="index"
        :style="initWheelItemDeg(item.index)"
      >
        <span
          class="text"
          :style="{ color: item.index === selected ? '#FFFFFF' : '#999999' }"
          >{{ item.value }}</span
        >
      </li>
    </ul>
    <!--<div class="cover" :style="getCoverStyle"></div>-->
    <div class="divider" :style="getDividerStyle"></div>

    <!--<div style="position: absolute;left: 0;font-size: 30px">{{value_}} {{selected}}</div>-->
  </div>
</template>

<script>
import Animate from "./animate";

const a = -0.003; // 加速度
let isInertial = false; // 是否正在惯性滑动

export default {
  name: "pickSelect",
  props: {
    //半径
    radius: {
      type: Number,
      default: 100,
    },
    //文字行高
    lineHeight: {
      type: Number,
      default: 36,
    },
    list: {
      type: Array,
      require: true,
      default: () => {
        return [];
      },
    },
    value: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      values: this.list || [],
      finger: {
        startY: 0,
        endY: 0,
        startTime: 0, // 开始滑动时间（单位：毫秒）
        endTime: 0, // 结束滑动时间（单位：毫秒）
        currentMove: 0,
        prevMove: 0,
      },
      range: {
        start: 0,
        end: 0,
        space: 0,
      },
      result: [],
      moveDeg: 0,
      selected: 0,
      value_: this.value,
      isDown:false
    };
  },
  //   watch: {
  //     value(val, oldVal) {
  //       console.log(oldVal);
  //       if (oldVal !== undefined) return;
  //       let index = this.list.indexOf(val);
  //       if (index === -1) return false;
  //       if (index > 0)
  //         this.values = [...this.list.slice(index), ...this.list.slice(0, index)];
  //       if (index === 0) this.values = this.list;
  //       this.value_ = this.values[0];
  //     },
  //   },
  computed: {
    singleDeg() {
      // 根据三角形余弦公式
      // 反余弦得到弧度再转换为度数,这个度数是单行文字所占有的。
      let deg = Math.round(
        (Math.acos(
          (this.radius * this.radius +
            this.radius * this.radius -
            this.lineHeight * this.lineHeight) /
            (2 * this.radius * this.radius)
        ) *
          180) /
          Math.PI
      );
      // deg这个值须360能整除，因为当滚动列占满一周后可以再次均匀的覆盖在上一周文字上；滚动时不会出现错位
      while (360 % deg !== 0 && deg <= 360) {
        deg += 1;
      }
      return deg;
    },
    // 半圆下的内容条数
    space() {
      return Math.floor(360 / this.singleDeg / 2);
    },
    //wrap高度根据半径决定
    getWrapperHeight() {
      return { height: `${2 * this.radius}px` };
    },
    //ul位置
    getListTop() {
      return {
        top: `${this.radius - Math.round(this.lineHeight / 2)}px`,
        height: `${this.lineHeight}px`,
      };
    },
    scrollValues() {
      const result = [];
      for (let i = this.range.start; i <= this.range.end; i += 1) {
        result.push({
          value: this.getRangeData(i),
          index: i,
        });
      }
      // console.log(result);
      return result;
    },
    animate() {
      return new Animate();
    },
    getCoverStyle() {
      return {
        backgroundSize: `100% ${
          this.radius - Math.round(this.lineHeight / 2)
        }px`,
      };
    },
    getDividerStyle() {
      return {
        top: `${this.radius - Math.round(this.lineHeight / 2)}px`,
        height: `${this.lineHeight - 2}px`,
      };
    },
  },
  mounted() {
    this.range.start = -this.space;
    this.range.end = this.space;
    this.range.space = this.space;

    //指定初始默认值
    if (this.value !== "") {
      let val = this.value;
      let index = this.list.indexOf(val);
      if (index === -1) return false;
      if (index > 0)
        this.values = [...this.list.slice(index), ...this.list.slice(0, index)];
      if (index === 0) this.values = this.list;
    }
    this.value_ = this.values[0];
  },
  methods: {
    initWheelItemDeg(index) {
      return {
        transform: `rotate3d(1, 0, 0, ${
          -1 * index * this.singleDeg
        }deg) translate3d(0, 0, ${this.radius}px)`,
        height: `${this.lineHeight}px`,
        lineHeight: `${this.lineHeight}px`,
      };
    },
    listenerTouchStart(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      isInertial = false;
      this.finger.startY = ev.targetTouches[0].pageY;
      this.finger.prevMove = this.finger.currentMove;
      this.finger.startTime = Date.now();
    },
    listenerTouchMove(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      const move =
        this.finger.startY - ev.targetTouches[0].pageY + this.finger.prevMove;
      this.moveDeg = move;
      this.finger.currentMove = move;
      this.$refs.wheel.style.transform = `rotate3d(1, 0, 0, ${
        (move / this.lineHeight) * this.singleDeg
      }deg)`;

      this.updateRange(Math.round(move / this.lineHeight));
    },
    listenerTouchEnd(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      this.finger.endY = ev.changedTouches[0].pageY;
      this.finger.endTime = Date.now();
      this.getInertiaDistance();
    },
    mousedown(e) {
      // console.log("按下", e);
      this.isDown = true;
      isInertial = false;
      this.finger.startY = e.screenY;
      this.finger.prevMove = this.finger.currentMove;
      this.finger.startTime = Date.now();
    },
    mouseup(e) {
      // console.log("弹起", e);
       this.isDown = false;
      this.finger.endY = e.screenY;
      this.finger.endTime = Date.now();
      this.getInertiaDistance();
    },
    mousemove(e) {
      // console.log("拖动", e);
      if(!this.isDown) return;
      const move =
        this.finger.startY - e.screenY + this.finger.prevMove;
      this.moveDeg = move;
      this.finger.currentMove = move;
      this.$refs.wheel.style.transform = `rotate3d(1, 0, 0, ${
        (move / this.lineHeight) * this.singleDeg
      }deg)`;
      this.updateRange(Math.round(move / this.lineHeight));
    },
    getRangeData(index) {
      index %= this.values.length;
      return this.values[index >= 0 ? index : index + this.values.length];
    },
    updateRange(spinAim) {
      this.range.start = this.range.space * -1 + spinAim;
      this.range.end = this.range.start + this.range.space * 2;
    },
    getSelectValue(move) {
      const index = Math.floor(move / this.lineHeight);
      const pickValue = this.getRangeData(index);
      this.selected = index;
      this.value_ = pickValue;
      this.$emit("select", pickValue);
    },
    /**
     * 求移动速度（v = s / t），判断用户操作快慢，从而得到惯性的滑动距离
     */
    getInertiaDistance() {
      // 移动距离
      const s = this.finger.startY - this.finger.endY;
      // 移动时间
      const t = this.finger.endTime - this.finger.startTime;
      // 移动速度
      const v = s / t;
      const absV = Math.abs(v);
      isInertial = true;

      //   if (Math.abs(s) < this.lineHeight) {
      //     this.$refs.wheel.style.transform = `rotate3d(1, 0, 0, 0deg)`;
      //     return;
      //   }

      this.inertia(absV, Math.floor(absV / v), 0);
    },
    /**
     * 用户结束滑动，应该慢慢放慢，最终停止。从而需要 a(加速度)
     * @param start 开始速度
     * @param position 速度方向，值: 正负1
     * @param target 结束速度
     */
    inertia(start, position, target) {
      if (start <= target || !isInertial) {
        this.animate.stop();
        this.finger.prevMove = this.finger.currentMove;
        this.updateRange(Math.round(this.finger.currentMove / this.lineHeight));
        this.getSelectValue(this.finger.currentMove);
        return;
      }
      // 这段时间走的位移 S = vt + 1/2at^2;
      const move =
        position * start * (1000 / 60) +
        0.5 * a * (1000 / 60) * (1000 / 60) +
        this.finger.currentMove;
      // 根据求末速度公式： v末 = v初 + at
      const newStart = position * start + a * (1000 / 60);
      let moveDeg = (move / this.lineHeight) * this.singleDeg;
      let actualMove = move;
      // 已经到达目标
      if (newStart <= target) {
        moveDeg = Math.round(move / this.lineHeight) * this.singleDeg;
        actualMove = Math.round(move / this.lineHeight) * this.lineHeight;
        this.$refs.wheel.style.transition =
          "transform 700ms cubic-bezier(0.19, 1, 0.22, 1)";
      } else {
        this.$refs.wheel.style.transition = "";
      }

      this.finger.currentMove = actualMove;
      this.$refs.wheel.style.transform = `rotate3d(1, 0, 0, ${moveDeg}deg)`;
      this.updateRange(Math.round(this.finger.currentMove / this.lineHeight));
      this.animate.start(this.inertia.bind(this, newStart, position, target));
    },
  },
  beforeDestory() {
    this.$el.removeEventListener("touchstart", this.listenerTouchStart, false);
    this.$el.removeEventListener("touchmove", this.listenerTouchMove, false);
    this.$el.removeEventListener("touchend", this.listenerTouchEnd, false);
  },
};
</script>

<style scoped lang="scss">
ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
}
.wrap {
  width: 100%;
  min-width: 50px;
  min-height: 50px;
  position: relative;
  .wheel {
    transform-style: preserve-3d;
    list-style: none;
    width: 100%;
    position: absolute;
    left: 0;
    .item {
      backface-visibility: hidden;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .text {
        color: #999999;
        font-size: 23px;
        letter-spacing: -0.2px;
      }
    }
  }
  .cover {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(
        180deg,
        rgba(153, 153, 153, 1),
        hsla(0, 0%, 100%, 0)
      ),
      linear-gradient(0deg, rgba(153, 153, 153, 1), hsla(0, 0%, 100%, 0));
    background-position: top, bottom;
    background-repeat: no-repeat;
  }
  .divider {
    position: absolute;
    width: 100%;
    left: 0;
    border-top: 1px solid #999999;
    border-bottom: 1px solid #999999;
  }
}
</style>
