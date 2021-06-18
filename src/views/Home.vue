<template>
  <div class="home">
    <h3>组件示例</h3>
    日期选择：
    <DataPicker initDate="2020-9-10" @date-change="dataChange"></DataPicker>
    <br /><br /><br />
    <hr />
    <div @click="handle">
      消息提示：
      <button data-type="success">成功</button>
      <button data-type="warning">提醒</button>
      <button data-type="error">错误</button>
      <button data-type="info">默认</button>
    </div>
    <br /><br /><br />
    <hr />
    <div class="flex">
      <CircleLoading></CircleLoading>
      <SmileLoading></SmileLoading>
    </div>

    <hr />
    <Switch></Switch>
    <br /><br /><br />
    <hr />
    <TimeSelect
      v-model:value="showTimeSelect"
      @input="showTimeSelect = $event"
      :selectTime="selectTime"
      :checkedWeeks="checkedWeeks"
      @timeChange="pickerChange"
      @weekChange="weekChange"
    ></TimeSelect>
    <button @click="showSelect">打开时间选择</button>
    <div>{{ selectTime }}</div>
    <hr />

    <Slide v-model="percent"></Slide>{{percent}}
  </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import DataPicker from "@/components/DatePicker/picker"; // @ is an alias to /src
import SmileLoading from "@/components/loading/SmileLoading";
import CircleLoading from "@/components/loading/CircleLoading";
import TimeSelect from "@/components/TimeSelect/index.vue";
import Switch from "@/components/switch";
import Slide from "@/components/Slide";

@Options({
  components: {
    DataPicker,
    SmileLoading,
    CircleLoading,
    TimeSelect,
    Switch,
    Slide,
  },
})
export default class Home extends Vue {
  showTimeSelect = false;
  checkedWeeks = [7, 1, 2];
  selectTime = {
    AmOrPm: "上午",
    hour: "8",
    minute: "30",
  };
  dataValue = "";
  percent = 0;
  pickerChange(val) {
    console.log(JSON.stringify({ ...val }));
    this.selectTime = val;
  }
  weekChange(val) {
    this.checkedWeeks = val;
    console.log(val);
  }
  handle(event) {
    const type = event.target.dataset.type || "";
    if (type) {
      this.$Message[type]("这是一个提示");
    }
  }
  dataChange({ year, month, day, format }) {
    this.dataValue = format;
    console.log(year, month, day);
  }
  showSelect() {
    this.showTimeSelect = true;
  }
}
// export default {
//   components: {
//     DataPicker,
//     Circle,
//     TimeSelect,
//   },
//   data() {
//     return {
//       showTimeSelect: false,
//       checkedWeeks: [7, 1, 2],
//       selectTime: {
//         AmOrPm: "上午",
//         hour: "8",
//         minute: "30",
//       },
//       dataValue: "",
//     };
//   },
//   methods: {
//     pickerChange(val) {
//       console.log(JSON.stringify({ ...val }));
//       this.selectTime = val;
//     },
//     weekChange(val) {
//       this.checkedWeeks = val;
//       console.log(val);
//     },
//     handle(event) {
//       let type = event.target.dataset.type || "";
//       if (type) {
//         this.$Message[type]("这是一个提示");
//       }
//     },
//     dataChange({ year, month, day, format }) {
//       this.dataValue = format;
//     },
//     showSelect() {
//       this.showTimeSelect = true;
//     },
//   },
// };
</script>
<style lang="scss">
.home {
  padding: 10px;
}
button {
  margin: 6px;
}
.flex {
  display: flex;
  align-items: center;
}
</style>
