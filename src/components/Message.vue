<template>
  <transition name="model-fade" appear>
    <div class="model" v-if="value && visible">
      <div class="messageConfirm" :style="{ background }">
        <div class="close" v-show="isShowClose" @click="close">
          <svg-icon iconClass="close"></svg-icon>
        </div>
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
    </div>
  </transition>
</template>

<script>
export default {
  name: "Message",
  props: {
    value: {
      type: Boolean,
      default: true,
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
    value(val) {
      this.visible = val;
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
      this.$emit("input", false);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/css/common.scss";
.model {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  overflow: auto;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
  .messageConfirm {
    position: relative;
    display: inline-block;
    width: px2rem(580px);
    vertical-align: middle;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    font-size: px2rem(16px);
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
        font-size: px2rem(46px);
        color: grey;
        position: absolute;
        top: 3px;
        right: 3px;
      }
    }

    .title {
      font-weight: normal;
      font-stretch: normal;
      padding-top: px2rem(15px);
      padding-bottom: px2rem(10px);
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
      padding: px2rem(30px) px2rem(158px) 0;
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
      width: px2rem(220px);
      height: px2rem(40px);
      color: rgba(51, 51, 51, 1);
      background: rgba(255, 255, 255, 1);
      border-radius: 5px;
      border: 1px solid rgba(153, 153, 153, 1);
      border-radius: 5px;
      font-size: px2rem(18px);
      margin: px2rem(74px) px2rem(20px) px2rem(44px);
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
}

.model-fade-enter,
.model-fade-leave-to {
  opacity: 0;
}
.model-fade-enter .messageConfirm,
.model-fade-leave-to .messageConfirm {
  transform: scale(1.1);
}
</style>
