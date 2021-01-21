<template>
  <div class="switch" :class="classText">
    <slot name="content">
      <span>关</span>
      <div class="icon" @click="change">
        <div class="line"></div>
        <div class="circle"></div>
      </div>
      <span>开</span>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(val) {
      this.value_ = val;
    },
  },
  computed: {
    classText() {
      return this.value_ ? "open" : "";
    },
  },
  data() {
    return {
      value_: false,
    };
  },
  methods: {
    change() {
      this.value_ = !this.value_;
      this.$emit("input", this.value_);
      this.$emit("change", this.value_);
    },
  },
  mounted() {
    this.value_ = this.value;
  },
};
</script>

<style scoped lang="scss">
.switch {
  display: inline-block;
  width: 100px;
  height: 36px;
  background: #666666;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 14px;
  color: #ffffff;
  line-height: 14px;
  border-radius: 17px;
  .icon {
    position: relative;
    width: 30px;
    height: 22px;
    .line {
      position: absolute;
      width: 100%;
      height: 1px;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      background: #ffffff;
    }
    .circle {
      position: absolute;
      left: 0;
      top: 0;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #ffffff;
      transform: translateX(-50%);
      transition: 0.5s;
    }
  }

  &.open {
    background: rgba(64, 129, 241, 1);
    .circle {
      left: 100%;
    }
  }
}
</style>