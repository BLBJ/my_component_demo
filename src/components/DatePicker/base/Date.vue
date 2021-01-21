
<template>
  <div class="container">
    <DataHeader
      :year="year"
      :month="month"
      :selectType="selectType"
      @date-change-prev="prev"
      @date-change-next="next"
      @to-select-month="toSelectMonth"
      @to-select-year="toSelectYear"
    ></DataHeader>
    <DateContent
      :year="year"
      :month="month"
      :day="day"
      v-bind="$attrs"
      v-show="!isShowSelectPanel"
    ></DateContent>
    <DateSelect
      :year="year"
      :month="month"
      :selectType="selectType"
      @select-month="selectMonth"
      @select-year="selectYear"
      v-show="isShowSelectPanel"
    ></DateSelect>
  </div>
</template>

<script>
import DataHeader from "./DateHeader";
import DateContent from "./DateContent";
import DateSelect from "./DateSelect";
export default {
  components: { DataHeader, DateContent, DateSelect },
  props: {
    value: {
      type: Object,
      dafault: () => {
        return {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate(),
        };
      },
    },
  },
  data() {
    return {
      year: this.value.year,
      month: this.value.month,
      day: this.value.day,
      isShowSelectPanel: false,
      selectType: "day",
    };
  },
  methods: {
    toSelectMonth() {
      this.isShowSelectPanel = true;
      this.selectType = "month";
    },
    toSelectYear() {
      this.selectType = "year";
    },
    selectMonth(val) {
      this.month = val;
      this.selectType = "day";
      this.isShowSelectPanel = false;
    },
    selectYear(val) {
      this.year = val;
      this.selectType = "month";
    },
    prev() {
      if (this.selectType === "month") {
        this.year--;
      } else if (this.selectType === "year") {
        this.year -= 12;
      } else {
        if (this.month === 1) {
          this.month = 12;
          this.year--;
        } else {
          this.month--;
        }
      }
    },
    next() {
      if (this.selectType === "month") {
        this.year++;
      } else if (this.selectType === "year") {
        this.year += 12;
      } else {
        if (this.month === 12) {
          this.month = 1;
          this.year++;
        } else {
          this.month++;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  left: 0;
  top: calc(100% + 2px);
  display: inline-block;
  background: #fff;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.15);
}
</style>