<template>
  <div class="timeSelect">
    <pickerSelect
      :list="AmOrPms"
      :radius="40"
      :value="value_.AmOrPm"
      @select="getSelectValueAmOrPm"
    ></pickerSelect>
    <pickerSelect
      :list="hours"
      :value="value_.hour"
      @select="getSelectValueHour"
    ></pickerSelect>
    <pickerSelect
      :list="minutes"
      :value="value_.minute"
      @select="getSelectValueMinute"
    ></pickerSelect>
  </div>
</template>

<script>
import pickerSelect from "./pickSelect";

export default {
  name: "picker",
  components: { pickerSelect },
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          AmOrPm: "",
          hour: "",
          minute: "",
        };
      },
    },
  },
  data() {
    return {
      selectedValue: "",
      AmOrPms: ["上午", "下午"],
      hours: [...[...Array(12)].map((a, i) => i + 1 + "")],
      minutes: [...[...Array(60)].map((a, i) => this.numFilter(i))],
      value_: this.value,
    };
  },
  watch: {
    value(v) {
      this.value_ = v;
    },
  },
  computed: {},
  mounted() {
    this.value_ = this.value;
  },
  methods: {
    numFilter(num) {
      if (num < 10) {
        return "0" + num;
      } else {
        return num + "";
      }
    },
    getSelectValueAmOrPm(val) {
      this.value.AmOrPm = val;
      this.$emit("timeChange", this.value);
    },
    getSelectValueHour(val) {
      this.value.hour = val;
      this.$emit("timeChange", this.value);
    },
    getSelectValueMinute(val) {
      this.value.minute = val;
      this.$emit("timeChange", this.value);
    },
  },
};
</script>

<style scoped lang="scss">
.timeSelect {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 80px;
  background: rgba(0, 0, 0, 0.8);
  align-items: center;
  overflow: hidden;
}
</style>
