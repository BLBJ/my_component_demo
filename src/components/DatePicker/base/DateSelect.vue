<template>
  <div class="date-select-panel">
    <div class="month-content" @click.stop="clickHandle">
      <span
        v-for="v in list"
        :key="v"
        :data-value="v"
        :class="{ selected: v === month && initYear === year || v === initYear }"
        >{{ v }}{{ selectType === "month" ? "月" : "" }}</span
      >
    </div>
  </div>
</template>

<script>
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
      default: "month",
    },
  },
  data() {
    return {
      initYear: this.year,
    };
  },
  computed: {
    list() {
      if (this.selectType === "year") {
        return [...Array(12)].map((v, i) => i + this.year);
      }
      if (this.selectType === "month") {
        return [...Array(12)].map((v, i) => i + 1);
      }
      return [];
    },
  },
  methods: {
    clickHandle(event) {
      if (event.target.tagName === "SPAN") {
        let val = +event.target.dataset.value || NaN;
        this.$emit("select-" + this.selectType, val);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.date-select-panel {
  .month-content {
    padding: 10px;
    span {
      display: inline-block;
      width: 33.3%;
      line-height: 50px;
      text-align: center;
      box-sizing: border-box;
      border: 1px solid transparent;
      cursor: pointer;
      &:hover {
        border: 1px solid#d8d4d4;
      }
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
  }
}
</style>