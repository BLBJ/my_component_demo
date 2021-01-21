<template>
  <div class="d_date_select" data-name="d_date_select">
    <input
      type="text"
      v-model="value"
      data-type="select"
      @focus="isShowPanel = true"
      placeholder="请选择日期"
    />
    <DataPanel
      v-if="isShowPanel"
      :value="value_"
      @date-select="dateSelect"
    ></DataPanel>
  </div>
</template>

<script>
import DataPanel from "./base/Date";

export default {
  components: { DataPanel },
  props: {
    format: {
      type: String,
      default: "YYYY-MM-DD",
    },
    initDate: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isShowPanel: false,
      value: this.initDate,
      value_: {},
    };
  },
  mounted() {
    this.on_body_event();
    if (this.initDate) {
      let str = this.format[4] || "-";
      let [year, month, day] = this.initDate.split(str).map(i=>+i);
      console.log(year, month, day)
      this.value_ = { year, month, day };
    }
  },
  methods: {
    on_body_event() {
      window.addEventListener("click", this.eventHandle);
    },
    eventHandle(event) {
      if (event.target.closest(".d_date_select")) return;
      this.isShowPanel = false;
    },
    dateSelect({ year, month, day }) {
      this.isShowPanel = false;
      this.value_ = { year, month, day };
      let FORMAT = this.format;
      FORMAT = FORMAT.replace("YYYY", year)
        .replace("MM", month)
        .replace("DD", day);
      this.value = FORMAT;
      this.$emit("date-change", {
        year,
        month,
        day,
        format: FORMAT,
      });
    },
  },
  beforeUnmount() {
    window.removeEventListener("click", this.eventHandle);
  },
};
</script>

<style lang="scss" scoped>
.d_date_select {
  position: relative;
  display: inline-block;
}
input {
  height: 25px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 14px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  outline: #5479c9;
  &::placeholder {
    color: #dcdee2;
  }
}
</style>