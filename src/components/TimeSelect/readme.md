### 使用介绍

#### 属性： 
+ `v-model`     显示/隐藏
+ `selectTime`  时间 `{ AmOrPm: "上午",  hour: "10", minute: "00"} `
+ `checkedWeeks`  每周频次 `[7,1,2]` 7代表周日、1周一、...

#### 事件方法：
+ `timeChange`   返回 时间对象`{ AmOrPm: "上午",  hour: "10", minute: "00"}`
+ `weekChange`   返回 频次对象 `[7,1,2]`
+ `save`     保存事件


---------------------

示例：

```
  <TimeSelect
      v-model="showTime"
       :selectTime="selectTime"
      :checkedWeeks="checkedWeeks"
      @timeChange="pickerChange"
      @weekChange="weekChange"
    ></TimeSelect>

    ...

import TimeSelect from "@/components/TimeSelect/index";
export default {
  components: { TimeSelect },
  data() {
    return {
      showTime: true,
      checkedWeeks:[7,1,2],
      selectTime:{
        AmOrPm: "上午",
        hour: "8",
        minute: "30",
      }
    };
  },
  methods: {
    pickerChange(val) {
      console.log(JSON.stringify({...val}));
    },
    weekChange(val) {
      console.log(val);   
    },
  },
};

```