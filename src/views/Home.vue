<template>
  <div class="home">
    <h3>组件示例</h3>
    日期选择： <DataPicker initDate="2020-9-10" @date-change="dataChange"></DataPicker>
    <br/>
  </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import DataPicker from "@/components/DatePicker/picker"; // @ is an alias to /src

@Options({
  components: {
    DataPicker,
  },
})
export default class Home extends Vue {

}
</script>
