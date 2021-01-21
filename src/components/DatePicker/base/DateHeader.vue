<template>
  <div @click.stop="clickHandle" class="header">
    <span class="title" v-show="selectType === 'day'" data-type="select_day"
      >{{ year }}年 {{ month }}月</span
    >
    <span class="title" v-show="selectType === 'month'" data-type="select_month"
      >{{ year }}年
    </span>
    <span class="title" v-show="selectType === 'year'" data-type="select_year"
      >{{ year }}-{{ year + 11 }}
    </span>
    <span class="arrow" data-type="select_prev">&lt;</span>
    <span class="arrow" data-type="select_next">&gt;</span>
  </div>
</template>

<script>
import { ref, computed, watch, toRefs } from "vue";

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
    selectType: {
      type: String,
      default: "day",
    },
  },
  data() {
    return {};
  },
  setup(props, { emit }) {
    const prev = () => {
      emit("date-change-prev");
    };
    const next = () => {
      emit("date-change-next");
    };
    const clickHandle = (event) => {
      const TYPE = event.target.dataset.type || "";
      if (!TYPE) return;
      switch (TYPE) {
        case "select_prev":
          prev();
          break;
        case "select_next":
          next();
          break;
        case "select_day":
          emit("to-select-month");
          break;
        case "select_month":
          emit("to-select-year");
          break;
        default:
          break;
      }
    };
    return {
      next,
      prev,
      clickHandle,
    };
  },
};
</script>

<style scoped lang="scss">
.header {
  text-align: center;
  user-select: none;
  width: 210px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding: 0 10px;
  span {
    line-height: 30px;
    padding: 0 10px;
    color: rgb(70, 65, 65);
    font-size: 17px;
    cursor: pointer;
  }
  .title {
    display: inline-block;
    width: 100px;
    background: transparent;
    margin-right: 30px;
  }
  .arrow {
    color: #d8d4d4;
    &:hover {
      color: rgb(70, 65, 65);
    }
  }
}
</style>