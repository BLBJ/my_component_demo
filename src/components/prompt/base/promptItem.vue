<template>
  <div
    :class="prompt_class"
    :name="name"
    :style="styles"
    v-html="content"
  ></div>
</template>

<script>
export default {
  props: {
    duration: {
      type: Number,
      default: 1.5,
    },
    type: {
      type: String,
    },
    content: {
      type: String,
      default: "",
    },
    styles: {
      type: Object,
      default: function () {
        return {
          right: "50%",
        };
      },
    },
    className: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    onClose: {
      type: Function,
    },
  },
  computed: {
    prompt_class() {
      return [`promptPanel`, `prompt-${this.type}`, ...this.class];
    },
  },
  data() {
    return {
      class: [],
    };
  },
  methods: {
    clearCloseTimer() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
      }
    },
    close() {
      this.onClose();
      this.$parent.close(this.name);
    },
    shake() {
      if (this.class.length) return;
      this.class.push("animate__animated");
      setTimeout(() => {
        this.class.pop();
      }, 1000);
    },
  },
  created() {},
  mounted() {
    this.clearCloseTimer();

    //    if (this.duration !== 0) {
    //       this.closeTimer = setTimeout(() => {
    //         // console.log(this.name)
    //         this.close();
    //       }, this.duration * 1000);
    //     }
  },
  beforeUnmount() {
    this.clearCloseTimer();
  },
};
</script>

<style scoped lang="scss">
.promptPanel {
  width: fit-content;
  margin: 0 auto;
  font-size: 14px;
  color: #ffffff;
  line-height: 26px;
  letter-spacing: 1px;
  padding: 0 14px;
  margin-bottom: 5px;
}

.prompt-info {
  background: rgba($color: #000000, $alpha: 0.5);
}

.prompt-error {
  background: rgba($color: #ed4014, $alpha: 1);
}

.prompt-success {
  background: rgba($color: #19be6b, $alpha: 1);
}

.prompt-warning {
  background: rgba($color: #fd9800, $alpha: 1);
}

.move-up-enter-from,
.move-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.move-up-enter-active,
.move-up-leave-active {
  transition: all 0.5s ease;
}
.animate__animated {
  animation: headShake 1s ease-in-out;
}
@keyframes headShake {
  0% {
    transform: translateX(-20px);
  }
  20% {
    transform: translateX(10px);
  }
  40% {
    transform: translateX(-8px);
  }
  60% {
    transform: translateX(5px);
  }
  80% {
    transform: translateX(0px);
  }
}
</style>