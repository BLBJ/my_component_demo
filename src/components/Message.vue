<template>
  <teleport to="body">
    <div class="model" v-show="modelValue && visible" @click="hide"></div>
    <div class="reference"></div>
    <transition
      name="model-fade"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      :css="false"
    >
      <div
        class="messageConfirm"
        v-show="modelValue && visible"
        :style="{ background }"
        ref="wrap"
      >
        <div class="close" v-show="isShowClose" @click="close"></div>
        <slot name="title">
          <div v-if="isShowTitle" class="title">{{ title }}</div>
        </slot>

        <slot name="content">
          <div class="content" :class="{ red: type === 'warning' }">
            <span>{{ content }}</span>
          </div>
        </slot>

        <slot name="btn">
          <div class="button" v-show="isShowBtn">
            <button
              class="btn blue"
              v-if="type !== 'confirm'"
              @click="btnClick"
            >
              {{ btnText }}
            </button>

            <button
              class="btn cancel"
              :class="{ blue: btnCancelType === 'info' }"
              v-if="type === 'confirm'"
              @click="cancel"
            >
              {{ cancelText }}
            </button>
            <button
              class="btn confirm"
              :class="{ blue: btnConfirmType === 'info' }"
              v-if="type === 'confirm'"
              @click="confirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </slot>
      </div>
    </transition>
  </teleport>
</template>

<script>
let mousePosition = null;
const getClickPosition = (e) => {
  mousePosition = {
    x: e.pageX,
    y: e.pageY,
  };
  // 100ms 内发生过点击事件，则从点击位置动画展示
  // 否则直接 zoom 展示
  // 这样可以兼容非点击方式展开
  console.log(mousePosition);
  setTimeout(() => (mousePosition = null), 100);
};

// 只有点击事件支持从鼠标位置动画展开
if (
  typeof window !== "undefined" &&
  window.document &&
  window.document.documentElement
) {
  document.addEventListener("click", getClickPosition, true);
}
export default {
  name: "Message",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "提示",
    },
    content: {
      type: String,
      default: "",
    },
    isShowTitle: {
      type: Boolean,
      default: true,
    },
    isShowClose: {
      type: Boolean,
      default: false,
    },
    isShowBtn: {
      type: Boolean,
      default: true,
    },
    btnText: {
      type: String,
      default: "知道了",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    confirmText: {
      type: String,
      default: "确定",
    },
    type: {
      type: String,
      default: "info",
    },
    btnCancelType: {
      type: String,
      default: "default",
    },
    btnConfirmType: {
      type: String,
      default: "info",
    },
    onBtn: {
      type: Function,
      default: () => {},
    },
    onOk: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
    background: {
      default: "rgba(250, 250, 250,1)",
    },
    btnControllable: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    modelValue(val) {
      this.visible = val;
      if (val) {
        this.$nextTick(this.reset);
      }
    },
  },
  computed: {},
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    close() {
      this.hide();
    },
    btnClick() {
      this.hide();
      this.onBtn();
    },
    cancel() {
      !this.btnControllable && this.hide();
      this.onCancel();
    },
    confirm() {
      !this.btnControllable && this.hide();
      this.onOk();
    },
    hide() {
      this.visible = false;
      this.$emit("update:modelValue", false);
    },
    reset() {
      const el = document.querySelector(".reference");
      el.style.display = "block";
      const rect = el.getBoundingClientRect();
      console.log("reset:", mousePosition, rect);
      this.$refs.wrap.style.transformOrigin = `${mousePosition.x -
        rect.left}px ${mousePosition.y - rect.top}px`;
    },
    beforeEnter(el) {
      console.log("beforeEnter");
      el.style.transform = "scale(0)";
      el.style.transition = ".3s";
    },
    enter(el, done) {
      console.log("enter");
      setTimeout(done, 100);
    },
    afterEnter(el) {
      console.log("afterEnter");
      el.style.transform = "scale(1)";
    },
    leave(el, done) {
      console.log("leave");
      el.style.transform = "scale(0)";
    }
  },
  mounted() {
    console.log("mounted");
  },
};
</script>

<style scoped lang="scss">
.model {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  overflow: auto;
  z-index: 2000;
}
.reference {
  position: absolute;
  top: 100px;
  left: calc(50% - 290px);
}
.messageConfirm {
  position: absolute;
  z-index: 2001;
  top: 100px;
  left: calc(50% - 290px);
  width: 580px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  font-size: 16px;
  transition: all 0.3s ease;
  .close {
    position: absolute;
    right: 0;
    top: 0;
    padding: 5px;
    cursor: pointer;
    font-size: 24px;
    color: #636363;
    .svg-icon {
      font-size: 46px;
      color: grey;
      position: absolute;
      top: 3px;
      right: 3px;
    }
  }

  .title {
    font-weight: normal;
    font-stretch: normal;
    padding-top: 15px;
    padding-bottom: 10px;
    font-size: 18px;
    line-height: 1;
    color: #303133;
    text-align: center;
  }
  .message_img {
    border-radius: 50%;
    width: 17px;
    margin-right: 3px;
  }

  .content {
    position: relative;
    padding: 30px 158px 0;
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 26px;
    letter-spacing: 2px;
    text-align: center;
    &.red {
      color: #d0021b;
    }
  }

  .btn {
    width: 220px;
    height: 40px;
    color: rgba(51, 51, 51, 1);
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    border: 1px solid rgba(153, 153, 153, 1);
    border-radius: 5px;
    font-size: 18px;
    margin: 74px 20px 44px;
    outline: none;
    &.blue {
      background: rgba(64, 129, 241, 1);
      color: #ffffff;
      border: none;
    }
  }
  .button {
    display: flex;
    justify-content: space-evenly;
  }
}

.model-fade-enter-from,
.model-fade-leave-to {
  // transform: scale(0);
  opacity: 0;
}

.model-fade-enter-active,
.model-fade-leave-active {
  transition: 3s ease;
}
</style>
