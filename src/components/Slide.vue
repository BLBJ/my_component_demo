<template>
  <div class="slide_panel" ref="slide" @click="progressClick">
    <div class="slide_bg"></div>
    <div class="slide_active" :style="styleActive"></div>
    <div
      class="slide_point"
      :style="stylePoint"
      @mousedown.prevent="OnMouseDown"
    ></div>
  </div>
</template>

<script>
let currentOffsetX = 0;
export default {
  props: {
    modelValue: {
      type: [String, Number],
    },
  },
  data() {
    return {
      offsetX: 0,
      startPositionX: "",
      isDragAble: false,
      originWidth: 0,
    };
  },
  computed: {
    styleActive() {
      return {
        width: `${this.offsetX}px`,
      };
    },
    stylePoint() {
      return {
        transform: `translate(${this.offsetX}px,-50%)`,
      };
    },
  },
  mounted() {
    this.originWidth = document.querySelector(".slide_panel").offsetWidth || 0;
    const point = document.querySelector(".slide_point");
    point.addEventListener("touchstart", this.onTouchStart, false);
  },
  watch: {
    modelValue(percent) {
      this.offsetX = (this.originWidth * percent) / 100;
    },
  },
  methods: {
    emit() {
      this.$emit("change", Math.floor((this.offsetX / this.originWidth) * 100));
      this.$emit("update:modelValue", Math.floor((this.offsetX / this.originWidth) * 100));
    },
    OnMouseDown(event) {
      this.startPositionX = event.clientX;
      currentOffsetX = this.offsetX;
      document.addEventListener("mousemove", this.OnMouseMove);
      document.addEventListener("mouseup", this.OnMouseUp);
    },
    OnMouseMove(event) {
      const offsetX = event.clientX - this.startPositionX;
      const _offsetX = currentOffsetX + offsetX;
      this.offsetX =
        _offsetX > 0
          ? _offsetX > this.originWidth
            ? this.originWidth
            : _offsetX
          : 0;
      this.emit();
    },
    OnMouseUp() {
      document.removeEventListener("mouseup", this.OnMouseUp);
      document.removeEventListener("mousemove", this.OnMouseMove);
      this.emit();
    },
    onTouchStart(event) {
      this.startPositionX = event.touches[0].clientX;
      currentOffsetX = this.offsetX;
      document.addEventListener("touchmove", this.onTouchMove, false);
      document.addEventListener("touchend", this.onTouchEnd, false);
    },
    onTouchMove(event) {
      const offsetX = event.touches[0].clientX - this.startPositionX;
      const _offsetX = currentOffsetX + offsetX;
      this.offsetX =
        _offsetX > 0
          ? _offsetX > this.originWidth
            ? this.originWidth
            : _offsetX
          : 0;
      this.emit();
    },
    onTouchEnd() {
      document.removeEventListener("touchmove", this.onTouchMove);
      document.removeEventListener("touchend", this.onTouchEnd);
      this.emit();
    },
    progressClick(event) {
      const offsetX =
        event.clientX - this.$refs.slide.getBoundingClientRect().left;
      this.offsetX = offsetX;
      this.emit();
    },
  },
};
</script>

<style lang="scss" scoped>
.slide_panel {
  position: relative;
  width: 100%;
  height: 35px;
  width: 200px;
  .slide_bg {
    position: absolute;
    width: 100%;
    height: 10px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background: #a3beed;
    border-radius: 5px;
  }
  .slide_active {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 10px;
    background: #3372de;
    border-radius: 5px;
  }
  .slide_point {
    position: absolute;
    width: 25px;
    height: 25px;
    opacity: 1;
    background: #3372de;
    border-radius: 50%;
    left: -12.5px;
    top: 50%;
    cursor: pointer;
  }
}
</style>
