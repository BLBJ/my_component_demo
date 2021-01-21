<template>
  <transition name="model-fade" appear>
    <div class="model" v-if="dialogVisible">
      <div class="time-model">
        <div class="title">
          <a @click="close">取消</a>
          <span>{{ statusTxt }}</span>
          <a @click="saveTask">存储</a>
        </div>
        <div class="time">
          <TimePicker :value="selectTime" v-bind="$attrs"></TimePicker>
        </div>
        <div class="title" style="position: relative">
          <a>频次</a>
          <a @click="isOpenWeek = !isOpenWeek">
            <span class="result">{{ frequency }}</span>
            <i v-show="!isOpenWeek" class="el-icon-arrow-right"></i>
            <i v-show="isOpenWeek" class="el-icon-arrow-left"></i>
          </a>
          <div class="weekPanel" v-show="isOpenWeek">
            <ul>
              <li v-for="(w, index) in week" :key="index">
                <label :for="w.value">
                  {{ w.label }}
                  <input
                    type="checkbox"
                    style="opacity: 0"
                    :id="w.value"
                    :value="w.value"
                    v-model="checkedWeeks_"
                  />
                  <i
                    style="color: yellow"
                    v-show="checkedWeeks_.indexOf(w.value) !== -1"
                    class="el-icon-check"
                  ></i>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import TimePicker from "./TimePicker/index.vue";
export default {
  components: { TimePicker },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    statusTxt: {
      type: String,
      default: "",
    },
    selectTime: {
      type: Object,
      default: () => ({
        AmOrPm: "上午",
        hour: "10",
        minute: "00",
      }),
    },
    checkedWeeks: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      dialogVisible:  this.value,
      isOpenWeek: false,
      week: [
        { label: "周日", value: 7 },
        { label: "周一", value: 1 },
        { label: "周二", value: 2 },
        { label: "周三", value: 3 },
        { label: "周四", value: 4 },
        { label: "周五", value: 5 },
        { label: "周六", value: 6 },
      ],
      checkedWeeks_:this.checkedWeeks
    };
  },
  computed: {
    frequency() {
      let weeks = [...this.checkedWeeks_];
      if (weeks.length === 7) {
        return "每天";
      }
      let week = ["一", "二", "三", "四", "五", "六", "日"];
      return weeks.length > 0
        ? "每周" + weeks.sort().map((c) => week[c - 1])
        : "请选择频次";
    },
  },
  methods: {
    close() {
      this.dialogVisible = false;
      this.$emit("input", false);
    },
    saveTask() {
      console.log("触发save事件");
      this.$emit("save");
    },
    weekChange() {
      this.$emit("weekChange", this.checkedWeeks_);
    },
  },
  watch: {
    value(val) {
      console.log(val)
      this.dialogVisible = val;
    },
    checkedWeeks_(val) {
      this.$emit("weekChange", val);
    },
    checkedWeeks(val) {
      this.checkedWeeks_ = val;
    },
  },
};
</script>

<style scoped lang="scss">
.model {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}
.time-model {
  display: inline-block;
  width: 285px;
  vertical-align: middle;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  font-size: 16px;
  transition: all 0.3s ease;
  .title {
    display: flex;
    justify-content: space-between;
    color: #fff;
    background: #666;
    font-size: 16px;
    height: 40px;
    align-items: center;
    padding: 0 15px;
    a,
    span {
      color: #ccc;
    }
    a {
      cursor: pointer;
    }
  }

  .weekPanel {
    position: absolute;
    width: 260px;
    top: -100px;
    left: 100%;
    height: 300px;
    /*background: #000000;*/
    ul {
      list-style: none;
      background-color: #666;
      margin: 0;
      padding: 10px 0;
      li {
        line-height: 38px;
        padding: 5px 10px;
        text-align: left;
        background-color: rgba(0, 0, 0, 0.3);
        border-top: 1px solid #999999;
        label {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
}
.model-fade-enter-from,
.model-fade-leave-to {
  opacity: 0;
}
.model-fade-enter .time-model,
.model-fade-leave-to .time-model {
  transform: scale(1.1);
}
</style>