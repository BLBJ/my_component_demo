<template>
  <div class="">
    <DataPicker initDate="2020-9-10" @date-change="dataChange"></DataPicker>
  </div>
</template>

<script>
import DataPicker from "@/components/DatePicker/picker";

export default {
  components: {
    DataPicker
  },
  data(){
    return{
      dataValue:""
    }
  },
  methods: {
    dataChange({ year, month, day, format }) {
      this.dataValue = format;
    },
  },
};
</script>

