<template>
  <div class="date-content">
    <div class="date-content-in">
      <div class="date-weeks">
        <span v-for="val in weeks" :key="val">{{ val }}</span>
      </div>

      <transition-group
        name="list"
        tag="div"
        @mouseover="mouseover"
        @mouseout="mouseout"
        @click.stop="clickHandle"
      >
        <span
          v-for="(item, index) in daysArr"
          :key="index"
          :data-value="item.value"
          :data-type="item.type"
          :class="{
            active: isActive && item.value === new Date().getDate(),
            selected:
              item.type === 'current' &&
              year === initDate.year &&
              month === initDate.month &&
              item.value === initDate.day,
          }"
          >{{ item.value }}</span
        >
      </transition-group>
      <div>
        <div class="today" @click.stop="toToday">今天</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, toRefs, ref, watch } from "vue";
import {
  get_days_by_year_month,
  get_next_year_month,
  get_prev_year_month,
} from "./util";

let currentEle = null;
export default {
  props: {
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    month: {
      type: Number,
      default: new Date().getMonth() + 1,
    },
    day: {
      type: Number,
      default: new Date().getDate(),
    },
  },
  setup(props, { emit }) {
    const weeks = [ "一", "二", "三", "四", "五", "六","日",];

    //星期数转化 周一周日 0~6
    let getDay = (date) => {
      let day = date.getDay();
      if (day === 0) day = 7;
      return day - 1;
    };
    let { year, month } = toRefs(props);
    let daysArr = computed(() => {
      let mon = month.value - 1;
      let date_select = new Date(year.value, mon);
      let before_arr = [],
        current_month_arr = [],
        after_arr = [];

      let day_num = getDay(date_select);
      let date_select_ = new Date(year.value, mon);
      //* * * * 1 2 3 上个月的日历，如果存在
      while (day_num > 0) {
        date_select_.setDate(date_select_.getDate() - 1);
        before_arr.unshift({ type: "before", value: date_select_.getDate() });
        day_num--;
      }
      //month 当前日历数组
      while (date_select.getMonth() === mon) {
        current_month_arr.push({
          value: date_select.getDate(),
          type: "current",
        });
        date_select.setDate(date_select.getDate() + 1);
      }

      //下月补齐 27 28 29 39 * * *
      if (getDay(date_select) !== 0) {
        let num = getDay(date_select);
        for (let i = num; i < 7; i++) {
          after_arr.push({ value: i - num + 1, type: 'after' });
        }
      }
      return [...before_arr, ...current_month_arr, ...after_arr];
    });
    let isActive = computed(() => {
      let year_value = year.value;
      let month_value = month.value;
      let date = new Date();
      return (
        year_value === date.getFullYear() && month_value === date.getMonth() + 1
      );
    });
    const clickHandle = (event) => {
      if (event.target.tagName === "SPAN") {
        let day = event.target.dataset.value || NaN;
        emit("date-select", {
          year: year.value,
          month: month.value,
          day: +day,
        });
      }
    };
    return {
      weeks,
      daysArr,
      isActive,
      clickHandle,
    };
  },
  data() {
    return {
      initDate: {
        year: this.year,
        month: this.month,
        day: this.day,
      },
    };
  },
  methods: {
    mouseover(event) {
      if (currentEle) return;
      if (event.target.tagName === "SPAN") {
        event.target.classList.add("select");
        currentEle = event.target;
      }
    },
    mouseout(event) {
      if (!currentEle) return;
      if (event.target.tagName === "SPAN") {
        currentEle.classList.remove("select");
        currentEle = null;
      }
    },
    toToday() {
      this.$emit("date-select", {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      });
    },
  },
};
</script>

<style scoped lang="scss">
$width: 30px;
$height: 30px;
.date-content {
  padding: 10px;
  width: $width * 7;
  .date-content-in {
    span {
      display: inline-block;
      width: $width;
      line-height: $height;
      text-align: center;
      box-sizing: border-box;
      cursor: pointer;
      border: 1px solid transparent;
    }
    span[data-type="before"],
    span[data-type="after"] {
      color: #d8d4d4;
    }
    .active {
      background: rgb(59, 118, 228);
      color: #fff;
    }
    .select {
      border: 1px solid #d8d4d4;
    }
    .selected {
      border: 1px solid rgb(59, 118, 228);
    }
    .today {
      font-size: 13px;
      color: rgb(59, 118, 228);
      padding: 5px;
      cursor: pointer;
      text-align: right;
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>