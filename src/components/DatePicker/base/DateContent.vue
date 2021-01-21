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
            grey: item.type !== 'current',
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
    const weeks = ["日", "一", "二", "三", "四", "五", "六"];
    let { year, month } = toRefs(props);
    // let yearOrMonthChange = ref(false);
    // watch(year, (newValue, oldValue) => {
    //   yearOrMonthChange.value = true;
    // });
    // watch(month, (newValue, oldValue) => {
    //   yearOrMonthChange.value = true;
    // });
    let daysArr = computed(() => {
      let year_value = year.value;
      let month_value = month.value;
      const [prev_year, prev_month] = get_prev_year_month(
        year_value,
        month_value
      );
      const [next_year, next_month] = get_next_year_month(
        year_value,
        month_value
      );
      const days = get_days_by_year_month(year_value, month_value);
      const days_prev = get_days_by_year_month(prev_year, prev_month);
      const days_next = get_days_by_year_month(next_year, next_month);
      let day_prev_slice = new Date(`${year_value}/${month_value}/1`).getDay();
      let day_last_slice =
        6 - new Date(`${year_value}/${month_value}/${days}`).getDay();
      let day_arr = [...Array(days)].map((i, index) => ({
        value: index + 1,
        type: "current",
      }));
      let day_prev_arr = [...Array(days_prev)]
        .map((i, index) => ({ value: index + 1, type: "prev" }))
        .slice(days_prev - day_prev_slice, days_prev);
      let day_next_arr = [...Array(days_next)]
        .map((i, index) => ({ value: index + 1, type: "next" }))
        .slice(0, day_last_slice);
      return [...day_prev_arr, ...day_arr, ...day_next_arr];
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
    .grey {
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
  transition: all .5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>